import React, { createContext, useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
    item: any;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (item: any) => void;
    removeFromCart: (itemId: string) => void;
    clearCart: () => void;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType>({
    cart: [],
    addToCart: () => { },
    removeFromCart: () => { },
    clearCart: () => { },
    cartTotal: 0,
    cartCount: 0
});

export const useCart = () => useContext(CartContext);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [toastItem, setToastItem] = useState<any | null>(null);

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(i => i.item._id === product._id);
            if (existing) {
                return prev.map(i => i.item._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { item: product, quantity: 1 }];
        });

        // Show toast animation
        setToastItem(product);
        setTimeout(() => setToastItem(null), 2500);
    };

    const removeFromCart = (itemId: string) => {
        setCart(prev => prev.filter(i => i.item._id !== itemId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, current) => total + (current.item.price * current.quantity), 0);
    const cartCount = cart.reduce((count, current) => count + current.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount }}>
            {children}

            <AnimatePresence>
                {toastItem && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        style={{
                            position: 'fixed',
                            bottom: '30px',
                            right: '30px',
                            zIndex: 9999,
                            background: 'rgba(10,10,13,0.95)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,140,0,0.3)',
                            borderRadius: '16px',
                            padding: '16px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,140,0,0.15)'
                        }}
                    >
                        <div style={{
                            width: '40px', height: '40px', borderRadius: '10px',
                            background: 'rgba(255,140,0,0.1)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', overflow: 'hidden'
                        }}>
                            {toastItem.image ? (
                                <img src={toastItem.image} alt="Item" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
                            ) : (
                                <span style={{ fontSize: '20px' }}>🛒</span>
                            )}
                        </div>
                        <div>
                            <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--primary)', letterSpacing: '1px', marginBottom: '4px' }}>ADDED TO CART</div>
                            <div style={{ fontSize: '14px', fontWeight: '700', color: '#fff' }}>{toastItem.title}</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </CartContext.Provider>
    );
};
