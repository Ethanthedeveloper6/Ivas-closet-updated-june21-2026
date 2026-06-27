import { Link } from 'react-router-dom';
import { imgErr } from '../api/client';
import '../styles/about.css';

export default function About() {
    return (
        <div className="page-wrap">
            <section className="about-hero">
                <div className="container about-hero-inner">
                    <div className="about-hero-text">
                        <span className="section-label">Our Story</span>
                        <h1 className="section-title">Fashion that<br /><em style={{ fontStyle: 'italic', color: 'var(--brand-accent)' }}>speaks for you.</em></h1>
                        <p className="section-sub" style={{ textAlign: 'left' }}>IVAS Closet was born from a simple belief — that everyone deserves to feel confident and well-dressed, without compromise. We curate premium fashion for the modern Kenyan lifestyle.</p>
                        <Link to="/shop" className="btn-primary" style={{ marginTop: 28 }}>Shop the Collection →</Link>
                    </div>
                    <div className="about-hero-img">
                        <img src="/images/about_store.png" alt="IVAS Closet Store" onError={imgErr} />
                    </div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">What We Stand For</span>
                        <h2 className="section-title">Our Values</h2>
                    </div>
                    <div className="values-grid">
                        {[
                            { icon: '✨', title: 'Premium Quality', desc: "Every item is hand-selected for quality, craftsmanship, and longevity. We refuse to stock anything we wouldn't wear ourselves." },
                            { icon: '🌍', title: 'Locally Rooted', desc: 'Born and raised in Kenya, we understand the local fashion landscape like no one else. Style that fits the Kenyan lifestyle.' },
                            { icon: '💰', title: 'Fair Pricing', desc: "Premium fashion shouldn't break the bank. We work directly with suppliers to bring you the best prices without sacrificing quality." },
                            { icon: '🚀', title: 'Fast Delivery', desc: "We know you're excited about your new outfit. That's why we process and ship every order within 24 hours." },
                        ].map((v, i) => (
                            <div key={i} className="value-card">
                                <div className="value-icon">{v.icon}</div>
                                <h3>{v.title}</h3>
                                <p>{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="stats-band">
                <div className="container stats-inner">
                    <div className="stat-item"><span className="stat-big">2,400+</span><span className="stat-txt">Happy Customers</span></div>
                    <div className="stat-divider"></div>
                    <div className="stat-item"><span className="stat-big">500+</span><span className="stat-txt">Products Stocked</span></div>
                    <div className="stat-divider"></div>
                    <div className="stat-item"><span className="stat-big">4.9 ★</span><span className="stat-txt">Average Rating</span></div>
                    <div className="stat-divider"></div>
                    <div className="stat-item"><span className="stat-big">3 Years</span><span className="stat-txt">In Business</span></div>
                </div>
            </section>

            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">What We Offer</span>
                        <h2 className="section-title">Our Services</h2>
                        <p className="section-sub">More than just an online store. We're your complete fashion partner.</p>
                    </div>
                    <div className="services-grid">
                        {[
                            { num: '01', title: 'Online Shopping', desc: 'Browse and buy from our full collection 24/7 — from anywhere, at any time. Secure payment and instant order confirmation.' },
                            { num: '02', title: 'Personal Styling', desc: 'Not sure what to get? Our style team is available on WhatsApp to help you put together the perfect outfit for any occasion.' },
                            { num: '03', title: 'Nationwide Delivery', desc: 'We deliver to all major towns across Kenya via our trusted courier partners. Track your order from our website.' },
                            { num: '04', title: 'Easy Returns', desc: "Something doesn't fit? No worries. We offer hassle-free returns and exchanges within 7 days of delivery." },
                            { num: '05', title: 'Gift Wrapping', desc: "Make someone's day extra special with our premium gift wrapping service. Available for all orders at checkout." },
                            { num: '06', title: 'Loyalty Program', desc: 'Every purchase earns you points. Redeem them for discounts on future orders and unlock exclusive member benefits.' },
                        ].map((s, i) => (
                            <div key={i} className="service-card">
                                <div className="service-num">{s.num}</div>
                                <h3 className="service-title">{s.title}</h3>
                                <p className="service-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
