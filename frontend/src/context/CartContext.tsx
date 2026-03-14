import React, { createContext, useContext, useState } from 'react';

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

    const addToCart = (product: any) => {
        setCart(prev => {
            const existing = prev.find(i => i.item._id === product._id);
            if (existing) {
                return prev.map(i => i.item._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { item: product, quantity: 1 }];
        });
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
        </CartContext.Provider>
    );
};
