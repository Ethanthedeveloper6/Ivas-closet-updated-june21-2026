const db = require('./db');
const bcrypt = require('bcryptjs');

console.log('🌱 Seeding database...');

// Check if products already exist
const count = db.prepare('SELECT COUNT(*) as cnt FROM products').get().cnt;
if (count > 0) {
    console.log('Database already seeded. Skipping.');
    process.exit(0);
}

// Seed admin user
const adminPw = bcrypt.hashSync('admin123', 10);
db.prepare(`
  INSERT OR IGNORE INTO users (name, email, password, role, points)
  VALUES (?, ?, ?, ?, ?)
`).run('Admin', 'admin@ivascloset.com', adminPw, 'admin', 0);

// Seed products
const products = [
    { name: "Air Luxe Sneaker", category: "shoes", gender: "men", price: 4800, old_price: 6200, image: "/images/product_shoes.png", rating: 5, badge: "new", description: "Premium white sneakers with cloud-like cushioning." },
    { name: "Strider Boot", category: "shoes", gender: "men", price: 6500, old_price: null, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating: 4, badge: null, description: "Rugged yet refined leather boots built for the city." },
    { name: "Pearl Heel", category: "shoes", gender: "women", price: 5200, old_price: 6800, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", rating: 5, badge: "sale", description: "Elegant heels with pearl-tone finish." },
    { name: "Bloom Flat", category: "shoes", gender: "women", price: 3400, old_price: null, image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80", rating: 4, badge: null, description: "Comfortable everyday flats with floral accent." },
    { name: "Mini Bounce", category: "shoes", gender: "children", price: 2200, old_price: 2800, image: "https://images.unsplash.com/photo-1581992652564-44c42f5ad3ad?w=600&q=80", rating: 5, badge: "sale", description: "Vibrant, durable sneakers built for young adventurers." },
    { name: "Sport Runner X", category: "shoes", gender: "men", price: 7200, old_price: null, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80", rating: 4, badge: "new", description: "Performance running shoes with adaptive sole." },
    { name: "Classic Linen Tee", category: "clothes", gender: "men", price: 1800, old_price: null, image: "/images/product_clothes.png", rating: 4, badge: null, description: "Breathable linen tee in a relaxed silhouette." },
    { name: "Tailored Blazer", category: "clothes", gender: "men", price: 8900, old_price: 11000, image: "/images/product_jacket.png", rating: 5, badge: "sale", description: "Sharp slim-fit blazer for the modern gentleman." },
    { name: "Floral Midi Dress", category: "clothes", gender: "women", price: 5400, old_price: null, image: "/images/product_dress.png", rating: 5, badge: "new", description: "Flowing floral dress perfect for every occasion." },
    { name: "Cozy Knit Sweater", category: "clothes", gender: "women", price: 3800, old_price: 4500, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", rating: 4, badge: "sale", description: "Ultra-soft knit sweater in seasonal tones." },
    { name: "Kids Denim Set", category: "clothes", gender: "children", price: 2900, old_price: null, image: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80", rating: 5, badge: "new", description: "Adorable matching denim set for little ones." },
    { name: "Summer Jogger", category: "clothes", gender: "women", price: 2600, old_price: null, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", rating: 4, badge: null, description: "Lightweight jogger pants that keep you cool." },
    { name: "Premium Knit Wear", category: "clothes", gender: "men", price: 4200, old_price: 5000, image: "/images/product_new_1.jpg", rating: 5, badge: "new", description: "Soft touch premium knit wear for daily use." },
    { name: "Elegant Evening Gown", category: "clothes", gender: "women", price: 9500, old_price: 12000, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", rating: 5, badge: "hot", description: "Stand out at any event with this stunning gown." },
    { name: "Urban Street Hoodie", category: "clothes", gender: "men", price: 3200, old_price: null, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", rating: 4, badge: null, description: "Comfortable urban hoodie with a relaxed fit." },
];

const insertProduct = db.prepare(`
  INSERT INTO products (name, category, gender, price, old_price, image, rating, badge, description)
  VALUES (@name, @category, @gender, @price, @old_price, @image, @rating, @badge, @description)
`);

const insertStock = db.prepare(`
  INSERT INTO stock (product_id, qty, active) VALUES (?, ?, 1)
`);

const seedAll = db.transaction(() => {
    for (const p of products) {
        const result = insertProduct.run(p);
        const qty = Math.floor(Math.random() * 50) + 10;
        insertStock.run(result.lastInsertRowid, qty);
    }
});

seedAll();

console.log(`✅ Seeded ${products.length} products with stock levels`);
console.log('✅ Admin user created: admin@ivascloset.com / admin123');
process.exit(0);
