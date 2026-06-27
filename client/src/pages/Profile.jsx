import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api, currency } from '../api/client';
import Avatar from '../components/Avatar';
import '../styles/profile.css';

const STATUS_COLORS = {
    confirmed: '#2563eb',
    shipped: '#7c3aed',
    delivered: '#16a34a',
    cancelled: '#dc2626',
};

export default function Profile() {
    const { user, logout, updateProfile, uploadAvatar, changePassword } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();

    const [tab, setTab] = useState('account');
    const [name, setName] = useState('');
    const [orders, setOrders] = useState([]);
    const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
    const [saving, setSaving] = useState(false);
    const fileRef = useRef();

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        setName(user.name);
        if (user.role === 'customer') {
            api.getOrders().then(setOrders).catch(() => setOrders([]));
        }
    }, [user]);

    if (!user) return null;

    const isCustomer = user.role === 'customer';

    const handleSaveName = async () => {
        if (!name.trim()) { showToast('Name cannot be empty', 'error'); return; }
        if (name.trim() === user.name) return;
        setSaving(true);
        try {
            await updateProfile(name.trim());
            showToast('Profile updated', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleAvatar = async (file) => {
        if (!file) return;
        try {
            await uploadAvatar(file);
            showToast('Photo updated 🎉', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        }
    };

    const handlePassword = async () => {
        if (!pwForm.current || !pwForm.next) { showToast('Fill in all password fields', 'error'); return; }
        if (pwForm.next.length < 6) { showToast('New password must be at least 6 characters', 'error'); return; }
        if (pwForm.next !== pwForm.confirm) { showToast('New passwords do not match', 'error'); return; }
        setSaving(true);
        try {
            await changePassword(pwForm.current, pwForm.next);
            setPwForm({ current: '', next: '', confirm: '' });
            showToast('Password changed', 'success');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { key: 'account', label: 'Account' },
        { key: 'security', label: 'Security' },
        ...(isCustomer ? [{ key: 'orders', label: `Orders (${orders.length})` }] : []),
    ];

    return (
        <div className="page-wrap profile-page">
            <div className="container">
                <header className="profile-header">
                    <div className="profile-avatar-wrap">
                        <Avatar user={user} size={96} />
                        <button className="avatar-edit-btn" onClick={() => fileRef.current.click()} title="Change photo">📷</button>
                        <input
                            type="file"
                            ref={fileRef}
                            hidden
                            accept="image/png,image/jpeg,image/webp"
                            onChange={e => handleAvatar(e.target.files[0])}
                        />
                    </div>
                    <div className="profile-identity">
                        <h1>{user.name}</h1>
                        <p className="profile-email">{user.email}</p>
                        <span className={`role-pill ${user.role}`}>{user.role === 'admin' ? '🛠 Administrator' : '🛍 Member'}</span>
                    </div>
                    <div className="profile-header-actions">
                        {user.role === 'admin' && <Link to="/admin" className="btn-primary">Admin Dashboard →</Link>}
                        <button className="btn-outline" onClick={() => { logout(); navigate('/'); }}>Log Out</button>
                    </div>
                </header>

                {isCustomer && (
                    <div className="profile-stat-row">
                        <div className="profile-stat">
                            <span className="ps-value">{(user.points || 0).toLocaleString()}</span>
                            <span className="ps-label">Loyalty Points</span>
                        </div>
                        <div className="profile-stat">
                            <span className="ps-value">{currency(user.points || 0)}</span>
                            <span className="ps-label">Discount Value</span>
                        </div>
                        <div className="profile-stat">
                            <span className="ps-value">{orders.length}</span>
                            <span className="ps-label">Orders Placed</span>
                        </div>
                    </div>
                )}

                <div className="profile-tabs">
                    {tabs.map(t => (
                        <button key={t.key} className={`profile-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
                    ))}
                </div>

                <div className="profile-panel">
                    {tab === 'account' && (
                        <div className="panel-card">
                            <h2>Account Details</h2>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input className="form-input" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input className="form-input" value={user.email} disabled />
                                <small className="field-hint">Email cannot be changed.</small>
                            </div>
                            <button className="btn-primary" disabled={saving} onClick={handleSaveName}>Save Changes</button>
                        </div>
                    )}

                    {tab === 'security' && (
                        <div className="panel-card">
                            <h2>Change Password</h2>
                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input type="password" className="form-input" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input type="password" className="form-input" value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} placeholder="At least 6 characters" />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input type="password" className="form-input" value={pwForm.confirm} onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })} />
                            </div>
                            <button className="btn-primary" disabled={saving} onClick={handlePassword}>Update Password</button>
                        </div>
                    )}

                    {tab === 'orders' && isCustomer && (
                        <div className="panel-card">
                            <h2>Order History</h2>
                            {orders.length === 0 ? (
                                <div className="empty-orders">
                                    <p>You haven't placed any orders yet.</p>
                                    <Link to="/shop" className="btn-primary">Start Shopping →</Link>
                                </div>
                            ) : (
                                <div className="order-list">
                                    {orders.map(o => (
                                        <div key={o.id} className="order-card">
                                            <div className="order-card-top">
                                                <div>
                                                    <strong>{o.id}</strong>
                                                    <span className="order-date">{new Date(o.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <span className="order-status" style={{ background: STATUS_COLORS[o.status] || '#666' }}>{o.status}</span>
                                            </div>
                                            <div className="order-items">
                                                {o.items.map(it => (
                                                    <div key={it.id} className="order-item">
                                                        <span>{it.name} <small>×{it.qty} · {it.size}</small></span>
                                                        <span>{currency(it.price * it.qty)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="order-card-bottom">
                                                <span>Total</span>
                                                <strong>{currency(o.total)}</strong>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
