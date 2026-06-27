const express = require('express');
const cors = require('cors');
const path = require('path');
const { authenticate } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());
app.use(authenticate);

// Serve uploaded images
app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/users', require('./routes/users'));
app.use('/api/contact', require('./routes/contact'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`🚀 IVAS Closet API running on http://localhost:${PORT}`);
});
