const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ivas-closet-secret-key-2026';

function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        req.user = null;
        return next();
    }
    try {
        const token = header.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        req.user = null;
        next();
    }
}

function requireAuth(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    next();
}

function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
}

function signToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, name: user.name, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

module.exports = { authenticate, requireAuth, requireAdmin, signToken, JWT_SECRET };
