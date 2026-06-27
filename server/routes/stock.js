const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/stock
router.get('/', (req, res) => {
    const stock = db.prepare(`
    SELECT s.*, p.name, p.category, p.price, p.image
    FROM stock s
    JOIN products p ON s.product_id = p.id
  `).all();
    res.json(stock);
});

// PUT /api/stock/:productId
router.put('/:productId', requireAdmin, (req, res) => {
    const { qty } = req.body;
    if (qty === undefined || qty < 0) {
        return res.status(400).json({ error: 'Valid quantity required' });
    }

    const existing = db.prepare('SELECT * FROM stock WHERE product_id = ?').get(req.params.productId);
    if (existing) {
        db.prepare('UPDATE stock SET qty = ? WHERE product_id = ?').run(qty, req.params.productId);
    } else {
        db.prepare('INSERT INTO stock (product_id, qty, active) VALUES (?, ?, 1)').run(req.params.productId, qty);
    }

    res.json({ product_id: parseInt(req.params.productId), qty });
});

module.exports = router;
