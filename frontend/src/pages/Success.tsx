import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Success: React.FC = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
        // Trigger some manual "confetti" particles with framer-motion since we don't have the canvas-confetti lib installed
    }, []);

    const particles = Array.from({ length: 40 });

    return (
        <div className="container" style={{ textAlign: 'center', padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -100, x: Math.random() * 800 - 400, opacity: 1, rotate: 0 }}
                    animate={{
                        y: 800,
                        x: (Math.random() * 800 - 400) * 2,
                        rotate: 360 * 2,
                        opacity: 0
                    }}
                    transition={{
                        duration: 3 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 2
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        width: '10px',
                        height: '10px',
                        backgroundColor: ['#febd69', '#232f3e', '#e47911', '#fff', '#ffd814'][Math.floor(Math.random() * 5)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '0%'
                    }}
                />
            ))}

            <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="card"
                style={{ maxWidth: '600px', margin: '0 auto', border: '1px solid #ddd', padding: '50px' }}
            >
                <div style={{ width: '80px', height: '80px', background: '#007600', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <span style={{ color: 'white', fontSize: '40px' }}>✓</span>
                </div>
                <h1 style={{ color: '#007600', marginBottom: '10px' }}>Order Placed!</h1>
                <p style={{ fontSize: '18px', color: '#555', marginBottom: '30px' }}>Thank you for shopping with Shopkart. Your order is being processed and will be shipped soon.</p>

                <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '12px 30px' }}>
                        Continue Shopping
                    </button>
                    <button className="btn-secondary" style={{ padding: '12px 30px' }}>
                        View Orders
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Success;
