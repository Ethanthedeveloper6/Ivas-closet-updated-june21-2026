import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { imgErr } from '../api/client';
import '../styles/auth.css';

export default function Login() {
    const { user, login, register } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [tab, setTab] = useState(searchParams.get('signup') !== null ? 'signup' : 'login');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirm, setSignupConfirm] = useState('');
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState({});

    useEffect(() => {
        if (user) navigate(user.role === 'admin' ? '/admin' : '/');
    }, [user]);

    const handleLogin = async () => {
        setError('');
        if (!loginEmail || !loginPassword) { setError('Please fill in all fields.'); return; }
        try {
            const u = await login(loginEmail, loginPassword);
            showToast(`Welcome back, ${u.name}! 👋`, 'success');
            setTimeout(() => navigate(u.role === 'admin' ? '/admin' : '/'), 500);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSignup = async () => {
        setError('');
        if (!signupName || !signupEmail || !signupPassword) { setError('Please fill in all fields.'); return; }
        if (signupPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (signupPassword !== signupConfirm) { setError('Passwords do not match.'); return; }
        try {
            const u = await register(signupName, signupEmail, signupPassword);
            showToast(`Account created! Welcome, ${u.name}! 🎉`, 'success');
            setTimeout(() => navigate('/'), 500);
        } catch (err) {
            setError(err.message);
        }
    };

    const togglePw = (field) => setShowPw(prev => ({ ...prev, [field]: !prev[field] }));

    return (
        <div className="page-wrap auth-page">
            <div className="auth-container">
                {/* LEFT */}
                <div className="auth-left">
                    <div className="auth-brand"><img src="/images/logo.jpg" alt="IVAS Closet Logo" className="logo-img" /></div>
                    <h2 className="auth-tagline">Your style journey starts here.</h2>
                    <p className="auth-desc">Log in to track your orders, save your wishlist, and enjoy a personalized shopping experience.</p>
                    <div className="auth-features">
                        <div className="auth-feature"><span className="af-icon">🛍️</span><span>Track your orders in real time</span></div>
                        <div className="auth-feature"><span className="af-icon">♡</span><span>Save items to your wishlist</span></div>
                        <div className="auth-feature"><span className="af-icon">🎁</span><span>Exclusive member-only offers</span></div>
                        <div className="auth-feature"><span className="af-icon">🚚</span><span>Faster checkout every time</span></div>
                    </div>
                    <div className="auth-hero-img">
                        <img src="/images/product_clothes.png" alt="Fashion" onError={imgErr} />
                    </div>
                </div>

                {/* RIGHT */}
                <div className="auth-right">
                    <div className="auth-tabs">
                        <button className={`auth-tab${tab === 'login' ? ' active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>Log In</button>
                        <button className={`auth-tab${tab === 'signup' ? ' active' : ''}`} onClick={() => { setTab('signup'); setError(''); }}>Sign Up</button>
                    </div>

                    {tab === 'login' ? (
                        <div>
                            <h1 className="auth-form-title">Welcome back</h1>
                            <p className="auth-form-sub">Sign in to your IVAS Closet account</p>
                            <div className="form-group" style={{ marginTop: 28 }}>
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" placeholder="your@email.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-password-wrap">
                                    <input type={showPw.login ? 'text' : 'password'} className="form-input" placeholder="Enter your password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                                    <button className="toggle-pw" onClick={() => togglePw('login')}>{showPw.login ? '🙈' : '👁'}</button>
                                </div>
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            <button className="btn-primary auth-submit-btn" onClick={handleLogin}>Log In →</button>
                            <div className="auth-divider"><span>or</span></div>
                            <div className="auth-hint">Don't have an account? <a href="#" onClick={e => { e.preventDefault(); setTab('signup'); setError(''); }}>Sign up free</a></div>
                            <div className="auth-hint" style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Admin login: admin@ivascloset.com / admin123
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h1 className="auth-form-title">Create account</h1>
                            <p className="auth-form-sub">Join IVAS Closet today — it's free</p>
                            <div className="form-group" style={{ marginTop: 28 }}>
                                <label className="form-label">Full Name</label>
                                <input type="text" className="form-input" placeholder="Your full name" value={signupName} onChange={e => setSignupName(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input type="email" className="form-input" placeholder="your@email.com" value={signupEmail} onChange={e => setSignupEmail(e.target.value)} />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-password-wrap">
                                    <input type={showPw.signup ? 'text' : 'password'} className="form-input" placeholder="Minimum 6 characters" value={signupPassword} onChange={e => setSignupPassword(e.target.value)} />
                                    <button className="toggle-pw" onClick={() => togglePw('signup')}>{showPw.signup ? '🙈' : '👁'}</button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input type="password" className="form-input" placeholder="Repeat your password" value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} />
                            </div>
                            {error && <div className="auth-error">{error}</div>}
                            <button className="btn-primary auth-submit-btn" onClick={handleSignup}>Create Account →</button>
                            <div className="auth-divider"><span>or</span></div>
                            <div className="auth-hint">Already have an account? <a href="#" onClick={e => { e.preventDefault(); setTab('login'); setError(''); }}>Log in</a></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
