const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../db');
const { signToken } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = db.prepare(
        'INSERT INTO users (name, email, password, role, points) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, hashed, 'customer', 0);

    const user = db.prepare('SELECT id, name, email, role, points, joined FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = signToken(user);

    res.status(201).json({ user, token });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password: _, ...safeUser } = user;
    const token = signToken(safeUser);

    res.json({ user: safeUser, token });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    const user = db.prepare('SELECT id, name, email, role, points, joined FROM users WHERE id = ?').get(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
});

module.exports = router;
