const express = require('express');
const router = express.Router();
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

// GET /api/users — admin only
router.get('/', requireAdmin, (req, res) => {
    const users = db.prepare('SELECT id, name, email, role, points, joined FROM users WHERE role = ?').all('customer');
    // Attach order count
    const getOrderCount = db.prepare('SELECT COUNT(*) as cnt FROM orders WHERE user_id = ?');
    const result = users.map(u => ({
        ...u,
        orderCount: getOrderCount.get(u.id).cnt
    }));
    res.json(result);
});

module.exports = router;
