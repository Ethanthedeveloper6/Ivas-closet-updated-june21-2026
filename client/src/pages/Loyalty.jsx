import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { currency } from '../api/client';
import '../styles/loyalty.css';

export default function Loyalty() {
    const { user } = useAuth();
    const pts = user?.role === 'customer' ? (user.points || 0) : 0;

    return (
        <div className="page-wrap">
            <section className="loyalty-hero">
                <div className="hero-bg-accent"></div>
                <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                    <div className="loyalty-badge">✨ IVAS Rewards</div>
                    <h1 className="loyalty-title">Earn while you Shop</h1>
                    <p className="loyalty-sub">Join our exclusive loyalty program and earn points on every purchase. Unlock premium fashion benefits.</p>

                    <div className={`loyalty-status-card${user ? ' active' : ' active'}`}>
                        {user?.role === 'customer' ? (
                            <>
                                <div className="ls-greeting">Welcome back, {user.name}!</div>
                                <div className="ls-points-wrap">
                                    <div className="ls-pts-val">{pts.toLocaleString()}</div>
                                    <div className="ls-pts-lbl">Available Points</div>
                                </div>
                                <div className="ls-cash-val">= {currency(pts)} discount value</div>
                                <div className="ls-progress-bar">
                                    <div className="lsp-inner" style={{ width: `${Math.min(100, (pts / 500) * 100)}%` }}></div>
                                </div>
                                <div className="ls-tier">Status: <strong>{pts >= 500 ? 'Gold Member 🥇' : pts >= 100 ? 'Silver Member 🥈' : 'Member'}</strong></div>
                                <Link to="/shop" className="btn-primary" style={{ marginTop: 20 }}>Shop and Earn More →</Link>
                            </>
                        ) : user?.role === 'admin' ? (
                            <p style={{ padding: 20 }}>Admins do not earn loyalty points.</p>
                        ) : (
                            <>
                                <p style={{ marginBottom: 20, fontWeight: 600, color: 'var(--text-secondary)' }}>Log in to view your points balance.</p>
                                <Link to="/login" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Log In / Register</Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Simple & Rewarding</span>
                        <h2 className="section-title">How It Works</h2>
                    </div>
                    <div className="loyalty-steps-grid">
                        {[
                            { num: '1', title: 'Join for Free', desc: "Create an account on IVAS Closet. It's completely free and takes seconds." },
                            { num: '2', title: 'Shop & Earn', desc: 'Earn 1 Reward Point for every KSh 100 spent on our premium products.' },
                            { num: '3', title: 'Redeem Discounts', desc: 'Use your points at checkout. 1 Point = KSh 1 off your total purchase. No minimum points required!' },
                        ].map((s, i) => (
                            <div key={i} className="step-card">
                                <div className="step-icon">{s.num}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section-sm" style={{ background: 'var(--bg-soft)' }}>
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">More Than Just Points</h2>
                    </div>
                    <div className="benefits-list">
                        {[
                            { icon: '🚚', title: 'Priority Shipping', desc: 'All members get prioritized order processing on their purchases.' },
                            { icon: '🎉', title: 'Early Access', desc: 'Get notified about new drops and sales before anyone else.' },
                            { icon: '🎁', title: 'Birthday Surprises', desc: 'Special bonus points and discounts during your birthday month.' },
                        ].map((b, i) => (
                            <div key={i} className="benefit-item">
                                <div className="bi-icon">{b.icon}</div>
                                <div>
                                    <h4>{b.title}</h4>
                                    <p>{b.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {!user && (
                <section className="section" style={{ textAlign: 'center' }}>
                    <div className="container">
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Ready to get rewarded?</h2>
                        <Link to="/login" className="btn-primary" style={{ padding: '16px 36px', fontSize: '1.05rem' }}>Join IVAS Rewards →</Link>
                    </div>
                </section>
            )}
        </div>
    );
}
