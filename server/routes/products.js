const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../client/public/images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `product_${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, allowed.includes(ext));
    }
});

router.get('/', (req, res) => {
    const { category, gender, sort } = req.query;
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'all') {
        sql += ' AND category = ?';
        params.push(category);
    }
    if (gender && gender !== 'all') {
        sql += ' AND gender = ?';
        params.push(gender);
    }

    if (sort === 'price-asc') sql += ' ORDER BY price ASC';
    else if (sort === 'price-desc') sql += ' ORDER BY price DESC';
    else if (sort === 'rating') sql += ' ORDER BY rating DESC';
    else sql += ' ORDER BY id ASC';

    const products = db.prepare(sql).all(...params);
    res.json(products);
});

router.get('/:id', (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
});

router.post('/', requireAdmin, upload.single('image'), (req, res) => {
    const { name, category, gender, price, old_price, description, badge, stock_qty } = req.body;
    if (!name || !price || !description) {
        return res.status(400).json({ error: 'Name, price, and description are required' });
    }

    const image = req.file ? `/images/${req.file.filename}` : req.body.image_url || '/images/product_clothes.png';

    const result = db.prepare(`
    INSERT INTO products (name, category, gender, price, old_price, image, rating, badge, description)
    VALUES (?, ?, ?, ?, ?, ?, 5, ?, ?)
  `).run(name, category || 'clothes', gender || 'men', parseInt(price), old_price ? parseInt(old_price) : null, image, badge || null, description);

    db.prepare('INSERT INTO stock (product_id, qty, active) VALUES (?, ?, 1)')
        .run(result.lastInsertRowid, parseInt(stock_qty) || 10);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
});

router.put('/:id', requireAdmin, upload.single('image'), (req, res) => {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const { name, category, gender, price, old_price, description, badge } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : (req.body.image_url || product.image);

    db.prepare(`
    UPDATE products
    SET name = ?, category = ?, gender = ?, price = ?, old_price = ?, image = ?, badge = ?, description = ?
    WHERE id = ?
  `).run(
        name ?? product.name,
        category ?? product.category,
        gender ?? product.gender,
        price !== undefined ? parseInt(price) : product.price,
        old_price !== undefined ? (old_price ? parseInt(old_price) : null) : product.old_price,
        image,
        badge !== undefined ? (badge || null) : product.badge,
        description ?? product.description,
        req.params.id
    );

    if (req.body.stock_qty !== undefined) {
        const qty = parseInt(req.body.stock_qty) || 0;
        const existing = db.prepare('SELECT product_id FROM stock WHERE product_id = ?').get(req.params.id);
        if (existing) db.prepare('UPDATE stock SET qty = ? WHERE product_id = ?').run(qty, req.params.id);
        else db.prepare('INSERT INTO stock (product_id, qty, active) VALUES (?, ?, 1)').run(req.params.id, qty);
    }

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updated);
});

router.delete('/:id', requireAdmin, (req, res) => {
    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true, id: parseInt(req.params.id) });
});

module.exports = router;
