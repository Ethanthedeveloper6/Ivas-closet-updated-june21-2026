const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/contact
router.post('/', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    db.prepare('INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)')
        .run(name, email, subject || '', message);

    res.status(201).json({ success: true, message: 'Message sent successfully' });
});

module.exports = router;
