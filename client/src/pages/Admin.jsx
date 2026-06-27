import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, currency, imgErr } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Stars } from '../components/ProductCard';
import '../styles/admin.css';

export default function Admin() {
    const { user, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [tab, setTab] = useState('dashboard');
    const [collapsed, setCollapsed] = useState(false);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [stock, setStock] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [orderSearch, setOrderSearch] = useState('');
    const [orderFilter, setOrderFilter] = useState('all');
    const [orderDetail, setOrderDetail] = useState(null);

    // Upload state
    const [uploadForm, setUploadForm] = useState({ name: '', category: 'clothes', gender: 'men', price: '', old_price: '', description: '', badge: '', stock_qty: '10' });
    const [uploadImage, setUploadImage] = useState(null);
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileRef = useRef();

    useEffect(() => {
        if (!user || user.role !== 'admin') {
            navigate('/login');
            return;
        }
        loadData();
    }, [user]);

    const loadData = async () => {
        try {
            const [p, o, s, u] = await Promise.all([
                api.getProducts(),
                api.getOrders().catch(() => []),
                api.getStock(),
                api.getUsers().catch(() => []),
            ]);
            setProducts(p);
            setOrders(o);
            setStock(s);
            setCustomers(u);
        } catch { }
    };

    // Dashboard metrics
    const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
    const lowStock = stock.filter(s => s.qty < 10).length;

    const filteredOrders = orders.filter(o => {
        if (orderFilter !== 'all' && o.status !== orderFilter) return false;
        if (orderSearch) {
            const q = orderSearch.toLowerCase();
            return o.id.toLowerCase().includes(q) || o.customer_name.toLowerCase().includes(q);
        }
        return true;
    });

    const updateStatus = async (orderId, status) => {
        try {
            await api.updateOrderStatus(orderId, status);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
            showToast(`Order ${orderId} → ${status}`, 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const updateStockQty = async (productId, qty) => {
        try {
            await api.updateStock(productId, qty);
            setStock(prev => prev.map(s => s.product_id === productId ? { ...s, qty } : s));
            showToast('Stock updated', 'success');
        } catch {
            showToast('Failed to update stock', 'error');
        }
    };

    const handleUpload = async () => {
        if (!uploadForm.name || !uploadForm.price || !uploadForm.description) {
            showToast('Name, price, and description are required', 'error');
            return;
        }
        try {
            const formData = new FormData();
            Object.entries(uploadForm).forEach(([k, v]) => formData.append(k, v));
            if (uploadImage) formData.append('image', uploadImage);
            await api.createProduct(formData);
            showToast('Product added successfully! 🎉', 'success');
            setUploadForm({ name: '', category: 'clothes', gender: 'men', price: '', old_price: '', description: '', badge: '', stock_qty: '10' });
            setUploadImage(null);
            setUploadPreview(null);
            loadData();
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handleImageSelect = (file) => {
        if (!file) return;
        setUploadImage(file);
        const reader = new FileReader();
        reader.onload = (e) => setUploadPreview(e.target.result);
        reader.readAsDataURL(file);
    };

    const navItems = [
        { key: 'dashboard', icon: '📊', label: 'Dashboard' },
        { key: 'orders', icon: '📦', label: 'Orders' },
        { key: 'products', icon: '🏷️', label: 'Products' },
        { key: 'stock', icon: '📋', label: 'Stock' },
        { key: 'upload', icon: '⬆️', label: 'Upload' },
        { key: 'customers', icon: '👥', label: 'Customers' },
    ];

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="admin-body">
            {/* SIDEBAR */}
            <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
                <div className="admin-logo">
                    <img src="/images/logo.jpg" alt="IVAS" className="logo-img-admin" />
                    {!collapsed && <span style={{ color: '#fff', fontWeight: 800, marginLeft: 10, fontSize: '1.1rem' }}>IVAS<span style={{ color: 'var(--brand-accent)' }}>Admin</span></span>}
                </div>
                <nav className="admin-nav">
                    {navItems.map(n => (
                        <button key={n.key} className={`admin-nav-item${tab === n.key ? ' active' : ''}`} onClick={() => setTab(n.key)}>
                            <span className="ani">{n.icon}</span>
                            <span>{n.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="admin-sidebar-footer">
                    <div className="admin-user-row">
                        <div className="admin-avatar">A</div>
                        <div>
                            <div className="admin-name">Admin</div>
                            <div className="admin-role">Administrator</div>
                        </div>
                    </div>
                    <button className="admin-logout-btn" onClick={() => { logout(); navigate('/'); }}>Log Out</button>
                    <Link to="/" className="back-site-btn">← Back to Site</Link>
                </div>
            </aside>

            {/* CONTENT */}
            <div className="admin-content" style={{ marginLeft: collapsed ? 64 : 240 }}>
                <div className="admin-topbar">
                    <div className="admin-topbar-left">
                        <button className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>{collapsed ? '☰' : '✕'}</button>
                        <span className="admin-breadcrumb">{navItems.find(n => n.key === tab)?.label}</span>
                    </div>
                    <div className="admin-topbar-right">
                        <span className="admin-date">{new Date().toLocaleDateString('en-KE', { dateStyle: 'long' })}</span>
                        <Link to="/" style={{ fontSize: '0.82rem', color: 'var(--brand-accent)', fontWeight: 600 }}>View Store →</Link>
                    </div>
                </div>

                {/* DASHBOARD TAB */}
                {tab === 'dashboard' && (
                    <div className="admin-tab">
                        <h2 className="admin-section-title">Dashboard</h2>
                        <div className="kpi-grid">
                            <div className="kpi-card kpi-revenue"><div className="kpi-icon">💰</div><div className="kpi-val">{currency(totalRevenue)}</div><div className="kpi-label">Total Revenue</div></div>
                            <div className="kpi-card kpi-orders"><div className="kpi-icon">📦</div><div className="kpi-val">{orders.length}</div><div className="kpi-label">Total Orders</div></div>
                            <div className="kpi-card"><div className="kpi-icon">🏷️</div><div className="kpi-val">{products.length}</div><div className="kpi-label">Products</div></div>
                            <div className="kpi-card kpi-stock"><div className="kpi-icon">⚠️</div><div className="kpi-val">{lowStock}</div><div className="kpi-label">Low Stock Items</div></div>
                        </div>
                        <div className="admin-two-col">
                            <div className="admin-card">
                                <div className="card-header"><span className="card-title">Recent Orders</span><button className="card-action" onClick={() => setTab('orders')}>View All</button></div>
                                {orders.slice(0, 5).map(o => (
                                    <div key={o.id} className="mini-order-row" onClick={() => { setOrderDetail(o); setTab('orders'); }}>
                                        <div><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{o.id}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{o.customer_name}</div></div>
                                        <div style={{ textAlign: 'right' }}><div style={{ fontWeight: 700 }}>{currency(o.total)}</div><span className={`order-status status-${o.status}`}>{o.status}</span></div>
                                    </div>
                                ))}
                                {orders.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)' }}>No orders yet</div>}
                            </div>
                            <div className="admin-card">
                                <div className="card-header"><span className="card-title">Top Products</span></div>
                                {products.slice(0, 5).map(p => (
                                    <div key={p.id} className="mini-order-row">
                                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                            <img src={p.image} alt={p.name} onError={imgErr} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                                            <div><div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div><div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{p.category}</div></div>
                                        </div>
                                        <div style={{ fontWeight: 700 }}>{currency(p.price)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ORDERS TAB */}
                {tab === 'orders' && (
                    <div className="admin-tab">
                        <div className="tab-header-row">
                            <h2 className="admin-section-title">Orders</h2>
                            <div className="tab-actions">
                                <input type="text" className="form-input" placeholder="Search orders..." style={{ maxWidth: 220 }} value={orderSearch} onChange={e => setOrderSearch(e.target.value)} />
                                <select className="form-input" style={{ maxWidth: 140 }} value={orderFilter} onChange={e => setOrderFilter(e.target.value)}>
                                    <option value="all">All Status</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        <div className="admin-card">
                            <table className="admin-table">
                                <thead><tr><th>Order ID</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
                                <tbody>
                                    {filteredOrders.map(o => (
                                        <tr key={o.id}>
                                            <td style={{ fontWeight: 700 }}>{o.id}</td>
                                            <td>{o.customer_name}</td>
                                            <td>{new Date(o.created_at).toLocaleDateString('en-KE')}</td>
                                            <td style={{ fontWeight: 700 }}>{currency(o.total)}</td>
                                            <td><span className={`order-status status-${o.status}`}>{o.status}</span></td>
                                            <td>
                                                <select className="status-select" value={o.status} onChange={e => updateStatus(o.id, e.target.value)}>
                                                    <option value="confirmed">Confirmed</option>
                                                    <option value="shipped">Shipped</option>
                                                    <option value="delivered">Delivered</option>
                                                    <option value="cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredOrders.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No orders found</div>}
                        </div>
                    </div>
                )}

                {/* PRODUCTS TAB */}
                {tab === 'products' && (
                    <div className="admin-tab">
                        <h2 className="admin-section-title">Products ({products.length})</h2>
                        <div className="admin-products-grid">
                            {products.map(p => (
                                <div key={p.id} className="admin-product-card">
                                    <img src={p.image} alt={p.name} onError={imgErr} />
                                    <div className="apc-info">
                                        <div className="apc-name">{p.name}</div>
                                        <div className="apc-meta">{p.category} · {p.gender}{p.badge ? ` · ${p.badge}` : ''}</div>
                                        <div className="apc-price">{currency(p.price)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* STOCK TAB */}
                {tab === 'stock' && (
                    <div className="admin-tab">
                        <h2 className="admin-section-title">Stock Management</h2>
                        <div className="admin-card">
                            <table className="admin-table">
                                <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Update</th></tr></thead>
                                <tbody>
                                    {stock.map(s => (
                                        <tr key={s.product_id}>
                                            <td>
                                                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                                                    <img src={s.image} alt={s.name} onError={imgErr} style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />
                                                    <span style={{ fontWeight: 600 }}>{s.name}</span>
                                                </div>
                                            </td>
                                            <td>{s.category}</td>
                                            <td>{currency(s.price)}</td>
                                            <td style={{ fontWeight: 700, color: s.qty < 10 ? '#ff3b30' : 'inherit' }}>{s.qty}</td>
                                            <td><span className={`order-status ${s.qty < 10 ? 'status-cancelled' : s.qty < 20 ? 'status-shipped' : 'status-delivered'}`}>
                                                {s.qty < 10 ? 'Low' : s.qty < 20 ? 'Medium' : 'Good'}
                                            </span></td>
                                            <td>
                                                <input type="number" min="0" defaultValue={s.qty} style={{ width: 60, padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 8, textAlign: 'center' }}
                                                    onBlur={e => { const v = parseInt(e.target.value); if (!isNaN(v) && v !== s.qty) updateStockQty(s.product_id, v); }}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* UPLOAD TAB */}
                {tab === 'upload' && (
                    <div className="admin-tab">
                        <h2 className="admin-section-title">Upload New Product</h2>
                        <div className="upload-layout">
                            <div className="upload-form-card">
                                <div className="form-group">
                                    <label className="form-label">Product Name</label>
                                    <input type="text" className="form-input" value={uploadForm.name} onChange={e => setUploadForm({ ...uploadForm, name: e.target.value })} placeholder="e.g., Classic Leather Boot" />
                                </div>
                                <div className="upload-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Category</label>
                                        <select className="form-input" value={uploadForm.category} onChange={e => setUploadForm({ ...uploadForm, category: e.target.value })}>
                                            <option value="clothes">Clothing</option>
                                            <option value="shoes">Shoes</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Gender</label>
                                        <select className="form-input" value={uploadForm.gender} onChange={e => setUploadForm({ ...uploadForm, gender: e.target.value })}>
                                            <option value="men">Men</option>
                                            <option value="women">Women</option>
                                            <option value="children">Children</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="upload-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Price (KSh)</label>
                                        <input type="number" className="form-input" value={uploadForm.price} onChange={e => setUploadForm({ ...uploadForm, price: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Old Price (optional)</label>
                                        <input type="number" className="form-input" value={uploadForm.old_price} onChange={e => setUploadForm({ ...uploadForm, old_price: e.target.value })} />
                                    </div>
                                </div>
                                <div className="upload-row-2">
                                    <div className="form-group">
                                        <label className="form-label">Badge</label>
                                        <select className="form-input" value={uploadForm.badge} onChange={e => setUploadForm({ ...uploadForm, badge: e.target.value })}>
                                            <option value="">None</option>
                                            <option value="new">New</option>
                                            <option value="sale">Sale</option>
                                            <option value="hot">Hot</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Initial Stock</label>
                                        <input type="number" className="form-input" value={uploadForm.stock_qty} onChange={e => setUploadForm({ ...uploadForm, stock_qty: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Description</label>
                                    <textarea className="form-input" rows="3" value={uploadForm.description} onChange={e => setUploadForm({ ...uploadForm, description: e.target.value })} placeholder="Describe the product..."></textarea>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Product Image</label>
                                    <div className="upload-dropzone" onClick={() => fileRef.current?.click()}
                                        onDragOver={e => e.preventDefault()}
                                        onDrop={e => { e.preventDefault(); handleImageSelect(e.dataTransfer.files[0]); }}
                                    >
                                        {uploadPreview ? (
                                            <img src={uploadPreview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        ) : (
                                            <div>
                                                <div className="dz-icon">📸</div>
                                                <div className="dz-text">Click or drag image here</div>
                                                <div className="dz-hint">JPEG, PNG, WebP — max 5MB</div>
                                            </div>
                                        )}
                                        <input type="file" ref={fileRef} hidden accept="image/*" onChange={e => handleImageSelect(e.target.files[0])} />
                                    </div>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleUpload}>Upload Product →</button>
                            </div>
                            <div className="upload-preview-panel">
                                <div className="admin-product-card">
                                    <img src={uploadPreview || 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80'} alt="Preview" style={{ aspectRatio: '1', objectFit: 'cover' }} />
                                    <div className="apc-info">
                                        <div className="apc-name">{uploadForm.name || 'Product Name'}</div>
                                        <div className="apc-meta">{uploadForm.category} · {uploadForm.gender}</div>
                                        <div className="apc-price">{uploadForm.price ? currency(parseInt(uploadForm.price)) : 'KSh 0'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CUSTOMERS TAB */}
                {tab === 'customers' && (
                    <div className="admin-tab">
                        <h2 className="admin-section-title">Customers ({customers.length})</h2>
                        <div className="admin-card">
                            <table className="admin-table">
                                <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th>Points</th><th>Orders</th></tr></thead>
                                <tbody>
                                    {customers.map(c => (
                                        <tr key={c.id}>
                                            <td style={{ fontWeight: 600 }}>{c.name}</td>
                                            <td>{c.email}</td>
                                            <td>{new Date(c.joined).toLocaleDateString('en-KE')}</td>
                                            <td><span style={{ background: 'var(--brand-light)', color: 'var(--brand-accent)', padding: '2px 8px', borderRadius: 12, fontWeight: 700, fontSize: '0.82rem' }}>{c.points || 0}</span></td>
                                            <td>{c.orderCount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {customers.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>No customers yet</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
