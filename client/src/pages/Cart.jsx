import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, currency, imgErr } from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import '../styles/cart.css';

export default function Cart() {
    const { cart, removeFromCart, updateQty, clearCart, cartTotal } = useCart();
    const { user, refreshUser } = useAuth();
    const { showToast } = useToast();
    const [usePoints, setUsePoints] = useState(false);
    const [shipping, setShipping] = useState({ name: '', email: '', phone: '', address: '' });
    const [receipt, setReceipt] = useState(null);

    // Multi-buy calc
    const clothingItems = cart.filter(i => i.category === 'clothes');
    const clothingQty = clothingItems.reduce((s, i) => s + i.qty, 0);
    const multiBuyPct = clothingQty > 1 ? (clothingQty - 1) * 2.5 : 0;
    const clothingSubtotal = clothingItems.reduce((s, i) => s + (i.price * i.qty), 0);
    const multiBuyAmt = Math.floor(clothingSubtotal * (multiBuyPct / 100));

    const pts = user?.role === 'customer' ? (user.points || 0) : 0;
    const usablePts = Math.max(0, Math.min(pts, cartTotal - multiBuyAmt));
    const discount = usePoints ? usablePts : 0;
    const finalTotal = Math.max(0, cartTotal - multiBuyAmt - discount);
    const earnPts = Math.floor(finalTotal / 100);

    const handlePlaceOrder = async () => {
        if (!shipping.name || !shipping.email || !shipping.address) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        try {
            const order = await api.placeOrder({
                items: cart,
                shipping,
                pointsUsed: discount,
                multiBuyDiscount: multiBuyAmt,
            });
            clearCart();
            setReceipt(order);
            if (user) await refreshUser();
            showToast('Order placed successfully! 🎉', 'success');
        } catch (err) {
            showToast(err.message || 'Failed to place order', 'error');
        }
    };

    return (
        <div className="page-wrap">
            <div className="cart-layout container">
                {/* CART ITEMS */}
                <div className="cart-main">
                    <div className="cart-title-row">
                        <h1 className="cart-title">Shopping Cart</h1>
                        {cart.length > 0 && (
                            <button className="clear-cart-btn" onClick={() => { if (confirm('Clear all items from cart?')) clearCart(); }}>Clear All</button>
                        )}
                    </div>

                    {cart.length > 0 ? (
                        cart.map(item => (
                            <div key={item.key} className="cart-item">
                                <img src={item.image} alt={item.name} className="cart-item-img" onError={imgErr} />
                                <div className="cart-item-info">
                                    <div className="cart-item-name">{item.name}</div>
                                    <div className="cart-item-meta">{item.category} · Size: {item.size}</div>
                                    <div className="cart-item-price">{currency(item.price)}</div>
                                </div>
                                <div className="cart-item-qty">
                                    <button className="qty-btn" onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                                    <span className="qty-num">{item.qty}</span>
                                    <button className="qty-btn" onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                                </div>
                                <div className="cart-item-subtotal">{currency(item.price * item.qty)}</div>
                                <button className="remove-item-btn" onClick={() => removeFromCart(item.key)}>✕</button>
                            </div>
                        ))
                    ) : (
                        <div className="cart-empty">
                            <div className="cart-empty-icon">🛍️</div>
                            <h3>Your cart is empty</h3>
                            <p>Looks like you haven't added anything yet.</p>
                            <Link to="/shop" className="btn-primary" style={{ display: 'inline-flex', marginTop: 16 }}>Start Shopping →</Link>
                        </div>
                    )}
                </div>

                {/* ORDER SUMMARY */}
                <div className="cart-sidebar">
                    <div className="order-summary">
                        <h2 className="summary-title">Order Summary</h2>
                        <div className="summary-rows">
                            {cart.map(item => (
                                <div key={item.key} className="summary-row">
                                    <span>{item.name} ×{item.qty}</span>
                                    <span>{currency(item.price * item.qty)}</span>
                                </div>
                            ))}
                            {cart.length > 0 && (
                                <div className="summary-row" style={{ marginTop: 8 }}>
                                    <span>Shipping</span><span className="free-shipping">FREE</span>
                                </div>
                            )}
                            {multiBuyAmt > 0 && (
                                <div className="summary-row" style={{ color: '#007aff', fontWeight: 600 }}>
                                    <span>Multi-Buy Discount (-{multiBuyPct}%)</span>
                                    <span>-KSh {multiBuyAmt.toLocaleString()}</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="summary-row" style={{ color: '#30d158', fontWeight: 600 }}>
                                    <span>Points Used</span><span>-KSh {discount.toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                        <div className="summary-divider"></div>

                        {/* LOYALTY */}
                        {user?.role === 'customer' && cart.length > 0 && (
                            <div className="loyalty-box active">
                                <div className="loyalty-header">
                                    <div className="loyalty-title">✨ IVAS Rewards</div>
                                    <div className="loyalty-balance">{pts} pts</div>
                                </div>
                                <p className="loyalty-desc">Earn points on every purchase. 1 pt = 1 KSh discount.</p>
                                {usablePts > 0 && (
                                    <label className="loyalty-toggle">
                                        <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} />
                                        <span>Use {usablePts} pts (<span style={{ color: '#30d158' }}>-KSh {usablePts.toLocaleString()}</span>)</span>
                                    </label>
                                )}
                            </div>
                        )}

                        <div className="summary-total-row">
                            <span className="summary-total-label">Total</span>
                            <span className="summary-total-val">{currency(finalTotal)}</span>
                        </div>

                        {user?.role === 'customer' && cart.length > 0 && (
                            <span className="loyalty-earn-info">
                                Earn <span className="loyalty-earn-badge">{earnPts} pts</span> with this order
                            </span>
                        )}

                        {cart.length > 0 && (
                            <div className="checkout-form">
                                <div className="form-group">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-input" placeholder="Your full name" value={shipping.name} onChange={e => setShipping({ ...shipping, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" className="form-input" placeholder="your@email.com" value={shipping.email} onChange={e => setShipping({ ...shipping, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Phone (for WhatsApp updates)</label>
                                    <input type="tel" className="form-input" placeholder="+254 7XX XXX XXX" value={shipping.phone} onChange={e => setShipping({ ...shipping, phone: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Delivery Address</label>
                                    <textarea className="form-input" rows="2" placeholder="Street, Area, City" value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })}></textarea>
                                </div>
                            </div>
                        )}

                        <button className="btn-primary checkout-btn" disabled={!cart.length} onClick={handlePlaceOrder}>
                            Place Order →
                        </button>
                        <Link to="/shop" className="continue-shopping">← Continue Shopping</Link>
                    </div>
                </div>
            </div>

            {/* RECEIPT MODAL */}
            <div className={`modal-overlay${receipt ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && setReceipt(null)}>
                {receipt && (
                    <div className="receipt-modal">
                        <div className="receipt-header">
                            <div className="receipt-logo"><img src="/images/logo.jpg" alt="IVAS Closet Logo" className="logo-img-receipt" /></div>
                            <div className="receipt-check">✓</div>
                            <h2 className="receipt-title">Order Confirmed!</h2>
                            <p className="receipt-sub">Thank you, {receipt.customer_name}! Your order has been placed.</p>
                        </div>
                        <div className="receipt-id">Order ID: <strong>{receipt.id}</strong></div>
                        <div className="receipt-date">{new Date(receipt.created_at).toLocaleString('en-KE', { dateStyle: 'long', timeStyle: 'short' })}</div>
                        <div className="receipt-items">
                            {receipt.items?.map((i, idx) => (
                                <div key={idx} className="receipt-item">
                                    <span>{i.name} ({i.size}) ×{i.qty}</span>
                                    <span>{currency(i.price * i.qty)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="receipt-divider"></div>
                        {receipt.multi_buy_discount > 0 && (
                            <div className="receipt-discount-row" style={{ color: '#007aff' }}>
                                <span>Multi-Buy Discount</span><span>-KSh {receipt.multi_buy_discount.toLocaleString()}</span>
                            </div>
                        )}
                        {receipt.points_used > 0 && (
                            <div className="receipt-discount-row">
                                <span>Points Discount</span><span>-KSh {receipt.points_used.toLocaleString()}</span>
                            </div>
                        )}
                        <div className="receipt-total-row">
                            <span>Total Paid</span><strong>{currency(receipt.total)}</strong>
                        </div>
                        {receipt.points_earned > 0 && receipt.user_id && (
                            <div className="receipt-earn-row">You earned {receipt.points_earned} points!</div>
                        )}
                        <div className="receipt-delivery">
                            <div className="receipt-delivery-title">Delivery to:</div>
                            <div>{receipt.address}</div>
                        </div>
                        <div className="receipt-actions">
                            <button className="btn-primary" onClick={() => window.print()}>🖨 Print Receipt</button>
                            <button className="btn-secondary" onClick={() => setReceipt(null)}>Done</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
