import { useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import '../styles/contact.css';

export default function Contact() {
    const { showToast } = useToast();
    const [form, setForm] = useState({ name: '', email: '', subject: 'Order Inquiry', message: '' });

    const handleSend = async () => {
        if (!form.name || !form.email || !form.message) {
            showToast('Please fill in all required fields.', 'error');
            return;
        }
        try {
            await api.sendContact(form);
            showToast("Message sent! We'll get back to you soon. 🙏", 'success');
            setForm({ name: '', email: '', subject: 'Order Inquiry', message: '' });
        } catch {
            showToast('Failed to send message.', 'error');
        }
    };

    return (
        <div className="page-wrap">
            <div className="contact-header">
                <div className="container" style={{ textAlign: 'center' }}>
                    <span className="section-label">Reach Out</span>
                    <h1 className="section-title">We'd Love to Hear<br />From You</h1>
                    <p className="section-sub">Questions, style advice, or just want to say hello? We're always happy to help.</p>
                </div>
            </div>

            <section className="section-sm">
                <div className="container">
                    <div className="contact-ways-grid">
                        <a href="https://wa.me/254700000000" className="contact-way-card contact-wa" target="_blank" rel="noreferrer">
                            <div className="cw-icon">📱</div>
                            <h3>WhatsApp Us</h3>
                            <p>Chat with us directly — the fastest way to reach our team.</p>
                            <div className="cw-detail">+254 700 000 000</div>
                            <div className="cw-badge">Usually replies in &lt; 5 min</div>
                        </a>
                        <a href="tel:+254700000000" className="contact-way-card contact-call">
                            <div className="cw-icon">📞</div>
                            <h3>Call Us</h3>
                            <p>Prefer to speak to someone? Our team is available Mon–Sat.</p>
                            <div className="cw-detail">+254 700 000 000</div>
                            <div className="cw-badge">Mon–Sat, 9am–6pm EAT</div>
                        </a>
                        <a href="mailto:hello@ivascloset.com" className="contact-way-card contact-email">
                            <div className="cw-icon">✉️</div>
                            <h3>Email Us</h3>
                            <p>For detailed inquiries, order issues, or partnership requests.</p>
                            <div className="cw-detail">hello@ivascloset.com</div>
                            <div className="cw-badge">Response within 24 hours</div>
                        </a>
                    </div>
                </div>
            </section>

            <section className="section contact-form-section">
                <div className="container">
                    <div className="contact-form-grid">
                        <div className="contact-form-left">
                            <span className="section-label">Send a Message</span>
                            <h2 className="section-title" style={{ textAlign: 'left' }}>Get in Touch</h2>
                            <p style={{ color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.7 }}>Fill in the form and we'll get back to you as soon as possible. We love hearing from our customers!</p>
                            <div className="contact-info-list" style={{ marginTop: 36 }}>
                                <div className="contact-info-item">
                                    <div className="ci-icon">📍</div>
                                    <div><strong>Visit Us</strong><br /><span>Nairobi, Kenya (by appointment)</span></div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="ci-icon">🕐</div>
                                    <div><strong>Business Hours</strong><br /><span>Monday – Saturday, 9am – 6pm EAT</span></div>
                                </div>
                                <div className="contact-info-item">
                                    <div className="ci-icon">🌐</div>
                                    <div>
                                        <strong>Follow Us</strong><br />
                                        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                                            <a href="#" className="social-btn" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>📸</a>
                                            <a href="#" className="social-btn" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>👥</a>
                                            <a href="#" className="social-btn" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>🎵</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="contact-form-right">
                            <div className="contact-form-card">
                                <div className="form-group">
                                    <label className="form-label">Your Name</label>
                                    <input type="text" className="form-input" placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email Address</label>
                                    <input type="email" className="form-input" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Subject</label>
                                    <select className="form-input" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>
                                        <option>Order Inquiry</option>
                                        <option>Product Question</option>
                                        <option>Returns & Exchanges</option>
                                        <option>Partnership</option>
                                        <option>General Feedback</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Message</label>
                                    <textarea className="form-input" rows="5" placeholder="How can we help you?" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}></textarea>
                                </div>
                                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSend}>Send Message →</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
