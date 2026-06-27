import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState, useEffect, useRef } from 'react';

export default function Navbar() {
    const { user } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const navRef = useRef(null);
    const hamburgerRef = useRef(null);

    const path = location.pathname;

    useEffect(() => {
        setMobileOpen(false);
    }, [path]);

    useEffect(() => {
        function handleClickOutside(e) {
            if (hamburgerRef.current && !hamburgerRef.current.contains(e.target) &&
                navRef.current && !navRef.current.contains(e.target)) {
                setMobileOpen(false);
            }
        }
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const links = [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About' },
        { to: '/shop', label: 'Shop' },
        { to: '/loyalty', label: 'Rewards' },
        { to: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <nav className="navbar">
                <Link to="/" className="nav-logo">
                    <img src="/images/logo.jpg" alt="IVAS Closet Logo" className="logo-img" />
                </Link>
                <div className="nav-links">
                    {links.map(l => (
                        <Link key={l.to} to={l.to} className={path === l.to ? 'active' : ''}>{l.label}</Link>
                    ))}
                </div>
                <div className="nav-actions">
                    <Link to="/cart" className="nav-icon-btn" title="Cart">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 01-8 0" />
                        </svg>
                        {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                    </Link>
                    {user ? (
                        <Link
                            to={user.role === 'admin' ? '/admin' : '/loyalty'}
                            className="nav-icon-btn user-avatar-btn"
                            title={user.name}
                        >
                            {user.name.charAt(0).toUpperCase()}
                        </Link>
                    ) : (
                        <Link to="/login" className="btn-nav-login">Log In</Link>
                    )}
                </div>
                <div
                    className={`hamburger${mobileOpen ? ' open' : ''}`}
                    ref={hamburgerRef}
                    onClick={() => setMobileOpen(!mobileOpen)}
                >
                    <span></span><span></span><span></span>
                </div>
            </nav>
            <div className={`mobile-nav${mobileOpen ? ' open' : ''}`} ref={navRef}>
                {links.map(l => (
                    <Link key={l.to} to={l.to}>{l.label}</Link>
                ))}
                {!user && <Link to="/login">Log In / Sign Up</Link>}
                <Link to="/cart">🛒 Cart</Link>
            </div>
        </>
    );
}
