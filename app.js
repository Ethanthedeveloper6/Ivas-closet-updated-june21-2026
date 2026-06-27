// ===== IVAS CLOSET — SHARED APP MODULE =====

// ===== PRODUCT DATABASE =====
const PRODUCTS = [
  // SHOES
  { id: 1, name: "Air Luxe Sneaker", category: "shoes", gender: "men", price: 4800, oldPrice: 6200, image: "images/product_shoes.png", rating: 5, badge: "new", description: "Premium white sneakers with cloud-like cushioning." },
  { id: 2, name: "Strider Boot", category: "shoes", gender: "men", price: 6500, oldPrice: null, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80", rating: 4, badge: null, description: "Rugged yet refined leather boots built for the city." },
  { id: 3, name: "Pearl Heel", category: "shoes", gender: "women", price: 5200, oldPrice: 6800, image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80", rating: 5, badge: "sale", description: "Elegant heels with pearl-tone finish." },
  { id: 4, name: "Bloom Flat", category: "shoes", gender: "women", price: 3400, oldPrice: null, image: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80", rating: 4, badge: null, description: "Comfortable everyday flats with floral accent." },
  { id: 5, name: "Mini Bounce", category: "shoes", gender: "children", price: 2200, oldPrice: 2800, image: "https://images.unsplash.com/photo-1581992652564-44c42f5ad3ad?w=600&q=80", rating: 5, badge: "sale", description: "Vibrant, durable sneakers built for young adventurers." },
  { id: 6, name: "Sport Runner X", category: "shoes", gender: "men", price: 7200, oldPrice: null, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&q=80", rating: 4, badge: "new", description: "Performance running shoes with adaptive sole." },
  // CLOTHES
  { id: 7, name: "Classic Linen Tee", category: "clothes", gender: "men", price: 1800, oldPrice: null, image: "images/product_clothes.png", rating: 4, badge: null, description: "Breathable linen tee in a relaxed silhouette." },
  { id: 8, name: "Tailored Blazer", category: "clothes", gender: "men", price: 8900, oldPrice: 11000, image: "images/product_jacket.png", rating: 5, badge: "sale", description: "Sharp slim-fit blazer for the modern gentleman." },
  { id: 9, name: "Floral Midi Dress", category: "clothes", gender: "women", price: 5400, oldPrice: null, image: "images/product_dress.png", rating: 5, badge: "new", description: "Flowing floral dress perfect for every occasion." },
  { id: 10, name: "Cozy Knit Sweater", category: "clothes", gender: "women", price: 3800, oldPrice: 4500, image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80", rating: 4, badge: "sale", description: "Ultra-soft knit sweater in seasonal tones." },
  { id: 11, name: "Kids Denim Set", category: "clothes", gender: "children", price: 2900, oldPrice: null, image: "https://images.unsplash.com/photo-1519278409-1f56fdda7fe5?w=600&q=80", rating: 5, badge: "new", description: "Adorable matching denim set for little ones." },
  { id: 12, name: "Summer Jogger", category: "clothes", gender: "women", price: 2600, oldPrice: null, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80", rating: 4, badge: null, description: "Lightweight jogger pants that keep you cool." },
  { id: 13, name: "Premium Knit Wear", category: "clothes", gender: "men", price: 4200, oldPrice: 5000, image: "images/product_new_1.jpg", rating: 5, badge: "new", description: "Soft touch premium knit wear for daily use." },
  { id: 14, name: "Elegant Evening Gown", category: "clothes", gender: "women", price: 9500, oldPrice: 12000, image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&q=80", rating: 5, badge: "hot", description: "Stand out at any event with this stunning gown." },
  { id: 15, name: "Urban Street Hoodie", category: "clothes", gender: "men", price: 3200, oldPrice: null, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80", rating: 4, badge: null, description: "Comfortable urban hoodie with a relaxed fit." },
];

// ===== CART =====
function getCart() {
  return JSON.parse(localStorage.getItem('ivasCart') || '[]');
}
function saveCart(cart) {
  localStorage.setItem('ivasCart', JSON.stringify(cart));
  updateCartBadge();
}
function addToCart(productId, size = 'M') {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const key = `${productId}-${size}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, productId, size, qty: 1, name: product.name, price: product.price, image: product.image, category: product.category });
  }
  saveCart(cart);
  showToast(`"${product.name}" added to cart! 🛍️`, 'success');
}
function removeFromCart(key) {
  const cart = getCart().filter(i => i.key !== key);
  saveCart(cart);
}
function updateQty(key, qty) {
  const cart = getCart();
  const item = cart.find(i => i.key === key);
  if (item) { item.qty = qty; if (qty <= 0) return removeFromCart(key); }
  saveCart(cart);
}
function clearCart() { localStorage.removeItem('ivasCart'); updateCartBadge(); }
function getCartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.qty, 0);
}
function updateCartBadge() {
  const total = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => {
    el.textContent = total;
    el.style.display = total > 0 ? 'flex' : 'none';
  });
}

// ===== AUTH =====
function getUsers() { return JSON.parse(localStorage.getItem('ivasUsers') || '[]'); }
function saveUsers(users) { localStorage.setItem('ivasUsers', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('ivasCurrentUser') || 'null'); }
function setCurrentUser(user) { localStorage.setItem('ivasCurrentUser', JSON.stringify(user)); }
function logout() { localStorage.removeItem('ivasCurrentUser'); window.location.href = 'index.html'; }
function registerUser(name, email, password) {
  const users = getUsers();
  if (users.find(u => u.email === email)) return { ok: false, msg: 'Email already registered.' };
  const user = { id: Date.now(), name, email, password, role: 'customer', joined: new Date().toISOString(), points: 0 };
  users.push(user);
  saveUsers(users);
  setCurrentUser(user);
  return { ok: true, user };
}
function loginUser(email, password) {
  const users = getUsers();
  // Built-in admin
  if (email === 'admin@ivascloset.com' && password === 'admin123') {
    const admin = { id: 0, name: 'Admin', email, role: 'admin' };
    setCurrentUser(admin);
    return { ok: true, user: admin };
  }
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return { ok: false, msg: 'Invalid email or password.' };
  setCurrentUser(user);
  return { ok: true, user };
}

// ===== ORDERS & LOYALTY =====
function getOrders() { return JSON.parse(localStorage.getItem('ivasOrders') || '[]'); }
function saveOrders(orders) { localStorage.setItem('ivasOrders', JSON.stringify(orders)); }
function placeOrder(cart, user, shipping, pointsUsed = 0, multiBuyDiscount = 0) {
  const subtotal = getCartTotal();

  // Total discount includes both points and multi-buy volume discount
  const totalDiscount = pointsUsed + multiBuyDiscount;
  const total = Math.max(0, subtotal - totalDiscount);

  // You earn 1 point for every KSh 100 spent (after discounts)
  const pointsEarned = Math.floor(total / 100);

  const orders = getOrders();
  const order = {
    id: 'ORD-' + Date.now(),
    userId: user ? user.id : 'guest',
    customerName: user ? user.name : shipping.name,
    customerEmail: shipping.email,
    items: cart,
    subtotal: subtotal,
    discount: totalDiscount,
    pointsUsed: pointsUsed,
    multiBuyDiscount: multiBuyDiscount,
    pointsEarned: pointsEarned,
    total: total,
    shipping,
    status: 'confirmed',
    date: new Date().toISOString(),
  };
  orders.push(order);
  saveOrders(orders);

  // Update user points if logged in
  if (user && user.role === 'customer') {
    const users = getUsers();
    const dbUser = users.find(u => u.id === user.id);
    if (dbUser) {
      dbUser.points = (dbUser.points || 0) - pointsUsed + pointsEarned;
      saveUsers(users);
      // Update current user session
      user.points = dbUser.points;
      setCurrentUser(user);
    }
  }

  return order;
}

// ===== STOCK =====
function getStock() {
  const saved = localStorage.getItem('ivasStock');
  if (saved) return JSON.parse(saved);
  const stock = {};
  PRODUCTS.forEach(p => { stock[p.id] = { qty: Math.floor(Math.random() * 50) + 10, active: true }; });
  localStorage.setItem('ivasStock', JSON.stringify(stock));
  return stock;
}
function saveStock(stock) { localStorage.setItem('ivasStock', JSON.stringify(stock)); }

// ===== TOAST =====
function showToast(msg, type = 'default') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> ${msg}`;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3200);
}

// ===== STARS RENDER =====
function renderStars(rating) {
  let html = '<div class="product-stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<span class="${i <= rating ? 'star' : 'star star-empty'}">★</span>`;
  }
  html += '</div>';
  return html;
}

// ===== CURRENCY =====
function currency(n) { return 'KSh ' + n.toLocaleString(); }

// ===== NAVBAR INIT =====
function initNav() {
  updateCartBadge();
  const user = getCurrentUser();
  const navLogin = document.getElementById('navLoginBtn');
  const navUser = document.getElementById('navUserBtn');
  if (navLogin && navUser) {
    if (user) {
      navLogin.style.display = 'none';
      navUser.style.display = 'flex';
      navUser.title = user.name;
      navUser.textContent = user.name.charAt(0).toUpperCase();
    } else {
      navLogin.style.display = '';
      navUser.style.display = 'none';
    }
  }
  // Hamburger
  const ham = document.getElementById('hamburger');
  const mNav = document.getElementById('mobileNav');
  if (ham && mNav) {
    ham.addEventListener('click', () => {
      mNav.classList.toggle('open');
      ham.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!ham.contains(e.target) && !mNav.contains(e.target)) {
        mNav.classList.remove('open');
        ham.classList.remove('open');
      }
    });
  }
  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('active');
  });
}

// ===== PRODUCT IMAGE FALLBACK =====
function imgErr(img) { img.src = 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80'; }

// Auto-init on load
window.addEventListener('DOMContentLoaded', initNav);
