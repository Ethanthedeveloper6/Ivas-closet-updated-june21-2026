const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, 'ivas.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    points INTEGER DEFAULT 0,
    avatar TEXT,
    joined TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    gender TEXT NOT NULL,
    price INTEGER NOT NULL,
    old_price INTEGER,
    image TEXT,
    rating INTEGER DEFAULT 5,
    badge TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    phone TEXT,
    address TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    discount INTEGER DEFAULT 0,
    points_used INTEGER DEFAULT 0,
    multi_buy_discount INTEGER DEFAULT 0,
    points_earned INTEGER DEFAULT 0,
    total INTEGER NOT NULL,
    status TEXT DEFAULT 'confirmed',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    size TEXT NOT NULL,
    qty INTEGER NOT NULL,
    price INTEGER NOT NULL,
    category TEXT,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS stock (
    product_id INTEGER PRIMARY KEY,
    qty INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

const userColumns = db.prepare('PRAGMA table_info(users)').all();
if (!userColumns.some(c => c.name === 'avatar')) {
    db.exec('ALTER TABLE users ADD COLUMN avatar TEXT');
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'newtvnbrian@gmail.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '12428newton';
const ADMIN_NAME = process.env.ADMIN_NAME || 'Newton';

const existingAdmin = db.prepare('SELECT id FROM users WHERE email = ?').get(ADMIN_EMAIL);
if (existingAdmin) {
    db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(ADMIN_EMAIL);
} else {
    db.prepare("INSERT INTO users (name, email, password, role, points) VALUES (?, ?, ?, 'admin', 0)")
        .run(ADMIN_NAME, ADMIN_EMAIL, bcrypt.hashSync(ADMIN_PASSWORD, 10));
}
db.prepare("UPDATE users SET role = 'customer' WHERE role = 'admin' AND email != ?").run(ADMIN_EMAIL);
db.prepare("DELETE FROM users WHERE email = 'admin@ivascloset.com' AND email != ?").run(ADMIN_EMAIL);

module.exports = db;
