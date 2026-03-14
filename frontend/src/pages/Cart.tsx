import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Cart: React.FC = () => {
    const { cart, removeFromCart, cartTotal, cartCount } = useCart();
    const navigate = useNavigate();

    return (
        <div className="container" style={{ minHeight: '80vh', padding: '60px 0' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '800', letterSpacing: '-1px' }}>
                    YOUR <span className="text-gradient">CART.</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>
                    {cartCount === 0 ? 'Empty and waiting for perfection.' : `${cartCount} items curated for excellence.`}
                </p>
            </header>

            {cart.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass"
                    style={{ padding: '100px 0', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '80px', marginBottom: '20px', filter: 'grayscale(1) opacity(0.2)' }}>🛒</div>
                    <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '15px' }}>YOUR SELECTION IS EMPTY.</h2>
                    <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800', fontSize: '14px', letterSpacing: '1px' }}>
                        EXPLORE THE COLLECTION →
                    </Link>
                </motion.div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '40px', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {cart.map((cartItem, index) => (
                            <motion.div
                                key={cartItem.item._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass"
                                style={{ display: 'flex', padding: '30px', gap: '30px', background: 'rgba(255,255,255,0.02)' }}
                            >
                                <div style={{
                                    width: '160px', height: '160px', flexShrink: 0,
                                    background: 'rgba(255,255,255,0.03)', borderRadius: '16px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    padding: '20px'
                                }}>
                                    <img src={cartItem.item.image} alt={cartItem.item.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 5px 15px rgba(0,0,0,0.3))' }} />
                                </div>

                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ margin: '0', fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px' }}>{cartItem.item.title}</h3>
                                        <div style={{ fontSize: '22px', fontWeight: '800' }}>
                                            <span style={{ fontSize: '14px', color: 'var(--primary)', verticalAlign: 'top', marginRight: '4px' }}>$</span>
                                            {cartItem.item.price.toFixed(0)}
                                            <span style={{ fontSize: '14px', opacity: 0.5, verticalAlign: 'top' }}>.99</span>
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                        {cartItem.item.category || 'FEATURED'}
                                    </div>

                                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{
                                            background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
                                            padding: '8px 15px', fontSize: '13px', fontWeight: '700',
                                            border: '1px solid rgba(255,255,255,0.1)'
                                        }}>
                                            QTY: {cartItem.quantity}
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(cartItem.item._id)}
                                            style={{
                                                background: 'transparent', border: 'none', color: '#ff4d4d',
                                                fontSize: '11px', fontWeight: '800', cursor: 'pointer',
                                                letterSpacing: '1px', textTransform: 'uppercase'
                                            }}
                                        >
                                            Remove Item
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass"
                        style={{ padding: '30px', position: 'sticky', top: '120px' }}
                    >
                        <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '25px', letterSpacing: '1px' }}>SUMMARY</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
                            <span>Items ({cartCount})</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '500' }}>
                            <span>Processing</span>
                            <span style={{ color: '#00ff00', fontWeight: '700' }}>FREE</span>
                        </div>
                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', marginBottom: '20px' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <span style={{ fontSize: '16px', fontWeight: '800' }}>TOTAL</span>
                            <span style={{ fontSize: '24px', fontWeight: '800' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <button
                            onClick={() => navigate('/address')}
                            className="btn-primary"
                            style={{ width: '100%', height: '55px' }}
                        >
                            SECURE CHECKOUT
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Cart;
