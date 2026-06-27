import { currency, imgErr } from '../api/client';

export function Stars({ rating }) {
    return (
        <div className="product-stars">
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} className={i <= rating ? 'star' : 'star star-empty'}>★</span>
            ))}
        </div>
    );
}

export default function ProductCard({ product, onClick, onAddToCart, onWishlist }) {
    return (
        <div className="product-card" onClick={onClick}>
            <div className="product-img-wrap">
                <img src={product.image} alt={product.name} onError={imgErr} loading="lazy" />
                {product.badge && <span className={`product-badge badge-${product.badge}`}>{product.badge}</span>}
                <div className="product-actions">
                    {onWishlist && (
                        <button className="product-action-btn" title="Wishlist" onClick={(e) => { e.stopPropagation(); onWishlist(product); }}>♡</button>
                    )}
                </div>
            </div>
            <div className="product-info">
                <div className="product-category">{product.category} · {product.gender}</div>
                <div className="product-name">{product.name}</div>
                {product.description && <p className="product-desc">{product.description}</p>}
                <Stars rating={product.rating} />
                <div className="product-price-row">
                    <div>
                        <span className="product-price">{currency(product.price)}</span>
                        {product.old_price && <span className="product-price-old">{currency(product.old_price)}</span>}
                    </div>
                    {onAddToCart && (
                        <button className="btn-cart" onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}>
                            Add →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
