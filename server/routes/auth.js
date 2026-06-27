const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const db = require('../db');
const { signToken, requireAuth } = require('../middleware/auth');

const PUBLIC_FIELDS = 'id, name, email, role, points, avatar, joined';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'newtvnbrian@gmail.com';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../client/public/images'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `avatar_${req.user.id}_${Date.now()}${ext}`);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
    }
});

router.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }
    if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
        return res.status(400).json({ error: 'This email is reserved' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
        return res.status(400).json({ error: 'Email already registered' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const result = db.prepare(
        'INSERT INTO users (name, email, password, role, points) VALUES (?, ?, ?, ?, ?)'
    ).run(name, email, hashed, 'customer', 0);

    const user = db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(result.lastInsertRowid);
    const token = signToken(user);

    res.status(201).json({ user, token });
});

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

router.get('/me', requireAuth, (req, res) => {
    const user = db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(req.user.id);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
});

router.put('/profile', requireAuth, (req, res) => {
    const { name } = req.body;
    if (!name || !name.trim()) {
        return res.status(400).json({ error: 'Name is required' });
    }
    db.prepare('UPDATE users SET name = ? WHERE id = ?').run(name.trim(), req.user.id);
    const user = db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(req.user.id);
    res.json({ user, token: signToken(user) });
});

router.put('/password', requireAuth, (req, res) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    if (!bcrypt.compareSync(currentPassword, user.password)) {
        return res.status(400).json({ error: 'Current password is incorrect' });
    }
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.user.id);
    res.json({ success: true });
});

router.post('/avatar', requireAuth, upload.single('avatar'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'A valid image file is required' });
    }
    const avatar = `/images/${req.file.filename}`;
    db.prepare('UPDATE users SET avatar = ? WHERE id = ?').run(avatar, req.user.id);
    const user = db.prepare(`SELECT ${PUBLIC_FIELDS} FROM users WHERE id = ?`).get(req.user.id);
    res.json({ user, token: signToken(user) });
});

module.exports = router;
