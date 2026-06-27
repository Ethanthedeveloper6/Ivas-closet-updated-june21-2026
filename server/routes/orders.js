const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => {
    let orders;
    if (req.user.role === 'admin') {
        orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    } else {
        orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
    }

    const getItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    orders = orders.map(o => ({
        ...o,
        items: getItems.all(o.id)
    }));

    res.json(orders);
});

router.post('/', (req, res) => {
    const { items, shipping, pointsUsed = 0, multiBuyDiscount = 0 } = req.body;
    if (!items || !items.length || !shipping || !shipping.name || !shipping.email || !shipping.address) {
        return res.status(400).json({ error: 'Items and shipping info are required' });
    }

    const subtotal = items.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const totalDiscount = pointsUsed + multiBuyDiscount;
    const total = Math.max(0, subtotal - totalDiscount);
    const pointsEarned = Math.floor(total / 100);
    const orderId = 'ORD-' + Date.now();

    const userId = req.user ? req.user.id : null;

    const insertOrder = db.prepare(`
    INSERT INTO orders (id, user_id, customer_name, customer_email, phone, address, subtotal, discount, points_used, multi_buy_discount, points_earned, total, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')
  `);

    const insertItem = db.prepare(`
    INSERT INTO order_items (order_id, product_id, name, size, qty, price, category)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

    const placeOrderTx = db.transaction(() => {
        insertOrder.run(orderId, userId, shipping.name, shipping.email, shipping.phone || '', shipping.address, subtotal, totalDiscount, pointsUsed, multiBuyDiscount, pointsEarned, total);

        for (const item of items) {
            insertItem.run(orderId, item.productId, item.name, item.size, item.qty, item.price, item.category || '');
        }

        if (userId && req.user.role === 'customer') {
            db.prepare('UPDATE users SET points = MAX(0, points - ? + ?) WHERE id = ?')
                .run(pointsUsed, pointsEarned, userId);
        }
    });

    placeOrderTx();

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    res.status(201).json({ ...order, items: orderItems });
});

router.put('/:id/status', requireAdmin, (req, res) => {
    const { status } = req.body;
    const valid = ['confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!valid.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id);
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    res.json(order);
});

router.delete('/:id', requireAdmin, (req, res) => {
    const order = db.prepare('SELECT id FROM orders WHERE id = ?').get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    db.prepare('DELETE FROM orders WHERE id = ?').run(req.params.id);
    res.json({ success: true, id: req.params.id });
});

module.exports = router;
