import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-grid">
                <div className="footer-col">
                    <div className="footer-logo"><img src="/images/logo.jpg" alt="IVAS Closet Logo" className="logo-img" /></div>
                    <p className="footer-desc">Premium fashion curated for the modern lifestyle. Quality you can see, comfort you can feel.</p>
                    <div className="footer-socials">
                        <a href="#" className="social-btn" title="Instagram">📸</a>
                        <a href="#" className="social-btn" title="Facebook">👥</a>
                        <a href="#" className="social-btn" title="Twitter">🐦</a>
                        <a href="#" className="social-btn" title="TikTok">🎵</a>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>Quick Links</h4>
                    <div className="footer-links">
                        <Link to="/">Home</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/shop">Shop</Link>
                        <Link to="/loyalty">Rewards</Link>
                        <Link to="/contact">Contact</Link>
                        <Link to="/cart">Cart</Link>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>Help</h4>
                    <div className="footer-links">
                        <a href="#">Shipping Policy</a>
                        <a href="#">Returns & Exchanges</a>
                        <a href="#">Size Guide</a>
                        <a href="#">FAQ</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>Opening Hours</h4>
                    <div className="footer-links">
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Mon – Fri: 9am – 8pm</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Saturday: 9am – 6pm</span>
                        <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Sunday: Closed</span>
                    </div>
                </div>
                <div className="footer-col">
                    <h4>Contact Us</h4>
                    <div className="footer-contact-item">
                        <div className="footer-contact-icon">📱</div>
                        <div><a href="https://wa.me/254700000000" style={{ color: 'rgba(255,255,255,0.7)' }}>WhatsApp Us</a><br /><small>+254 700 000 000</small></div>
                    </div>
                    <div className="footer-contact-item">
                        <div className="footer-contact-icon">📞</div>
                        <div><a href="tel:+254700000000" style={{ color: 'rgba(255,255,255,0.7)' }}>Call Us</a><br /><small>Mon–Sat, 9am–6pm</small></div>
                    </div>
                    <div className="footer-contact-item">
                        <div className="footer-contact-icon">✉️</div>
                        <div><a href="mailto:hello@ivascloset.com" style={{ color: 'rgba(255,255,255,0.7)' }}>hello@ivascloset.com</a></div>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© 2026 IVAS Closet. All rights reserved.</span>
                <span>Made with ❤️ in Kenya</span>
            </div>
        </footer>
    );
}
