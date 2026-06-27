import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api, currency, imgErr } from '../api/client';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import '../styles/shop.css';

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [category, setCategory] = useState('all');
    const [gender, setGender] = useState('all');
    const [sort, setSort] = useState('default');
    const [sizeModal, setSizeModal] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [searchParams] = useSearchParams();
    const { addToCart } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        api.getProducts().then(data => {
            setProducts(data);
            // Read URL params
            const cat = searchParams.get('cat');
            const gen = searchParams.get('gender');
            if (cat) setCategory(cat);
            if (gen) setGender(gen);
        }).catch(() => { });
    }, []);

    useEffect(() => {
        let result = [...products];
        if (category !== 'all') result = result.filter(p => p.category === category);
        if (gender !== 'all') result = result.filter(p => p.gender === gender);
        if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
        if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
        if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
        setFiltered(result);
    }, [products, category, gender, sort]);

    const newArrivals = products.filter(p => p.badge === 'new');

    const openSizeModal = (product) => {
        const sizes = product.category === 'shoes'
            ? ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
            : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        setSizeModal({ product, sizes });
        setSelectedSize(sizes[0]);
    };

    const confirmAdd = () => {
        if (!sizeModal || !selectedSize) return;
        addToCart(sizeModal.product, selectedSize);
        showToast(`"${sizeModal.product.name}" added to cart! 🛍️`, 'success');
        setSizeModal(null);
    };

    const resetFilters = () => {
        setCategory('all');
        setGender('all');
        setSort('default');
    };

    return (
        <div className="page-wrap">
            {/* HEADER */}
            <div className="shop-header">
                <div className="container">
                    <span className="section-label">Our Collection</span>
                    <h1 className="section-title">Shop IVAS Closet</h1>
                    <p className="section-sub">Premium shoes and clothing for every style and season.</p>
                </div>
            </div>

            {/* CONTROLS */}
            <div className="shop-controls">
                <div className="container">
                    <div className="shop-controls-row">
                        <div className="category-dropdowns">
                            <div className="dropdown-wrap">
                                <select className="form-input shop-dropdown" value={category} onChange={e => setCategory(e.target.value)}>
                                    <option value="all">All Categories</option>
                                    <option value="shoes">👟 Shoes</option>
                                    <option value="clothes">👗 Clothing</option>
                                </select>
                            </div>
                            <div className="dropdown-wrap">
                                <select className="form-input shop-dropdown" value={sort} onChange={e => setSort(e.target.value)}>
                                    <option value="default">Sort: Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>
                        <div className="gender-filters">
                            {['all', 'men', 'women', 'children'].map(g => (
                                <button
                                    key={g}
                                    className={`filter-pill${gender === g ? ' active' : ''}`}
                                    onClick={() => setGender(g)}
                                >
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </button>
                            ))}
                        </div>
                        <div className="results-count">{filtered.length} item{filtered.length !== 1 ? 's' : ''}</div>
                    </div>
                </div>
            </div>

            {/* LATEST ARRIVALS */}
            {newArrivals.length > 0 && (
                <div className="latest-arrivals-bar">
                    <div className="container">
                        <span className="arrivals-label">✨ Latest Arrivals</span>
                        <div className="arrivals-strip">
                            {newArrivals.map(p => (
                                <div key={p.id} className="arrival-chip" onClick={() => openSizeModal(p)}>
                                    <img src={p.image} alt={p.name} onError={imgErr} />
                                    <div className="arrival-info">
                                        <div className="arrival-name">{p.name}</div>
                                        <div className="arrival-price">{currency(p.price)}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* PRODUCTS */}
            <section className="section-sm">
                <div className="container">
                    {filtered.length > 0 ? (
                        <div className="shop-products-grid">
                            {filtered.map(p => (
                                <ProductCard
                                    key={p.id}
                                    product={p}
                                    onClick={() => openSizeModal(p)}
                                    onAddToCart={() => openSizeModal(p)}
                                    onWishlist={() => showToast('Added to wishlist ♡', 'success')}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters</p>
                            <button className="btn-primary" onClick={resetFilters}>Clear Filters</button>
                        </div>
                    )}
                </div>
            </section>

            {/* SIZE MODAL */}
            <div className={`modal-overlay${sizeModal ? ' open' : ''}`} onClick={e => e.target === e.currentTarget && setSizeModal(null)}>
                <div className="modal" style={{ position: 'relative' }}>
                    <button className="modal-close" onClick={() => setSizeModal(null)}>✕</button>
                    {sizeModal && (
                        <>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 4 }}>{sizeModal.product.name}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: 20 }}>{currency(sizeModal.product.price)}</p>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>SELECT SIZE</div>
                            <div className="size-grid">
                                {sizeModal.sizes.map(s => (
                                    <button
                                        key={s}
                                        className={`size-btn${selectedSize === s ? ' selected' : ''}`}
                                        onClick={() => setSelectedSize(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <button className="btn-primary" style={{ width: '100%', marginTop: 24, justifyContent: 'center' }} onClick={confirmAdd}>
                                Add to Cart →
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
