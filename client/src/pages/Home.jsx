import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, currency, imgErr } from '../api/client';
import ProductCard, { Stars } from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import '../styles/home.css';

export default function Home() {
    const [products, setProducts] = useState([]);
    const { addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        api.getProducts().then(setProducts).catch(() => { });
    }, []);

    const trending = products.slice(0, 6);

    const handleAdd = (product) => {
        addToCart(product);
        showToast(`"${product.name}" added to cart! 🛍️`, 'success');
    };

    return (
        <div className="page-wrap">
            {/* HERO */}
            <section className="hero" id="hero">
                <div className="hero-content">
                    <div className="hero-tag">New Season 2026</div>
                    <h1 className="hero-title">Dress to<br /><em>Impress.</em></h1>
                    <p className="hero-sub">Curated fashion for those who appreciate quality — from premium footwear to handpicked clothing, for every moment of your life.</p>
                    <div className="hero-cta">
                        <Link to="/shop" className="btn-primary">Shop the Collection →</Link>
                        <Link to="/about" className="btn-secondary">Our Story</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="hero-stat"><span className="stat-num">2K+</span><span className="stat-label">Happy Customers</span></div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat"><span className="stat-num">500+</span><span className="stat-label">Styles Available</span></div>
                        <div className="hero-stat-divider"></div>
                        <div className="hero-stat"><span className="stat-num">100%</span><span className="stat-label">Quality Assured</span></div>
                    </div>
                </div>
                <div className="hero-image-wrap">
                    <div className="hero-bg-blob"></div>
                    <img src="/images/hero_banner.png" alt="IVAS Closet Fashion" className="hero-img" onError={imgErr} />
                    <div className="hero-float-card">
                        <span className="float-icon">🔥</span>
                        <div>
                            <div className="float-title">Trending Now</div>
                            <div className="float-sub">Pearl Heel Collection</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TRENDING */}
            <section className="section" id="trending">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">What's Hot</span>
                        <h2 className="section-title">Trending Products</h2>
                        <p className="section-sub">Our most-loved pieces right now — chosen by the IVAS community.</p>
                    </div>
                    <div className="products-grid">
                        {trending.map(p => (
                            <ProductCard
                                key={p.id}
                                product={p}
                                onClick={() => window.location.href = '/shop'}
                                onAddToCart={handleAdd}
                                onWishlist={() => showToast('Added to wishlist ♡', 'success')}
                            />
                        ))}
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <Link to="/shop" className="btn-secondary">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="categories-section section-sm">
                <div className="container">
                    <div className="categories-grid">
                        <Link to="/shop?cat=shoes&gender=men" className="cat-card cat-men">
                            <div className="cat-inner">
                                <div className="cat-icon">👟</div>
                                <h3>Men's Shoes</h3>
                                <p>From sneakers to boots</p>
                                <span className="cat-arrow">→</span>
                            </div>
                        </Link>
                        <Link to="/shop?cat=clothes&gender=women" className="cat-card cat-women">
                            <div className="cat-inner">
                                <div className="cat-icon">👗</div>
                                <h3>Women's Clothing</h3>
                                <p>Elegant & contemporary</p>
                                <span className="cat-arrow">→</span>
                            </div>
                        </Link>
                        <Link to="/shop?cat=shoes&gender=children" className="cat-card cat-kids">
                            <div className="cat-inner">
                                <div className="cat-icon">🎒</div>
                                <h3>Kids' Collection</h3>
                                <p>Fun, durable & cute</p>
                                <span className="cat-arrow">→</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="section testimonials-section" id="testimonials">
                <div className="container">
                    <div className="section-header">
                        <span className="section-label">Customer Love</span>
                        <h2 className="section-title">What Our Customers Say</h2>
                        <p className="section-sub">Real stories from real people who found their perfect look at IVAS Closet.</p>
                    </div>
                    <div className="testimonials-grid">
                        {[
                            { text: '"I ordered the Pearl Heel and they were absolutely stunning! The delivery was quick and the packaging was premium. IVAS Closet is now my go-to for shoes."', name: 'Amina Osei', loc: 'Nairobi, Kenya', initial: 'A' },
                            { text: '"The Tailored Blazer fits like it was made for me. Quality is exceptional — far better than I expected at this price point. Highly recommend IVAS Closet!"', name: 'David Kimani', loc: 'Mombasa, Kenya', initial: 'D', featured: true },
                            { text: '"Bought the Kids Denim Set for my daughter\'s birthday and she absolutely loves it! Great quality, true to size, and arrived beautifully wrapped. Will be back!"', name: 'Fatima Njoroge', loc: 'Kisumu, Kenya', initial: 'F' },
                            { text: '"I bought the Premium Knit Wear and the material is incredible! After several washes, it still looks brand new. IVAS Closet never disappoints."', name: 'Samuel Ochieng', loc: 'Nakuru, Kenya', initial: 'S' },
                            { text: '"Absolutely in love with the fast shipping and the beautiful presentation. It felt like receiving a gift. Highly recommend the shoe collection!"', name: 'Grace Mutua', loc: 'Eldoret, Kenya', initial: 'G' },
                        ].map((t, i) => (
                            <div key={i} className={`testimonial-card${t.featured ? ' featured' : ''}`}>
                                <div className="testimonial-stars">★★★★★</div>
                                <p className="testimonial-text">{t.text}</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{t.initial}</div>
                                    <div>
                                        <div className="author-name">{t.name}</div>
                                        <div className="author-loc">{t.loc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="testimonial-rating-bar">
                        <div className="rating-summary">
                            <div className="rating-big">4.9</div>
                            <div>
                                <div className="rating-stars-big">★★★★★</div>
                                <div className="rating-label">Based on 234 reviews</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
