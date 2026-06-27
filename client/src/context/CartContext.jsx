import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('ivasCart') || '[]');
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('ivasCart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, size = 'M') => {
        setCart(prev => {
            const key = `${product.id}-${size}`;
            const existing = prev.find(i => i.key === key);
            if (existing) {
                return prev.map(i => i.key === key ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, {
                key,
                productId: product.id,
                size,
                qty: 1,
                name: product.name,
                price: product.price,
                image: product.image,
                category: product.category,
            }];
        });
        return true;
    };

    const removeFromCart = (key) => {
        setCart(prev => prev.filter(i => i.key !== key));
    };

    const updateQty = (key, qty) => {
        if (qty <= 0) return removeFromCart(key);
        setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within CartProvider');
    return ctx;
}
