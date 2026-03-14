import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

const Success: React.FC = () => {
    const navigate = useNavigate();
    const { clearCart } = useCart();

    useEffect(() => {
        clearCart();
    }, []);

    const particles = Array.from({ length: 60 });

    return (
        <div className="container" style={{ textAlign: 'center', padding: '100px 0', overflow: 'hidden', position: 'relative', minHeight: '90vh' }}>
            {/* Particle Celebration */}
            {particles.map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ y: -20, x: Math.random() * 1000 - 500, opacity: 1, rotate: 0 }}
                    animate={{
                        y: 1000,
                        x: (Math.random() * 1000 - 500) * 1.5,
                        rotate: 720,
                        opacity: 0
                    }}
                    transition={{
                        duration: 4 + Math.random() * 2,
                        repeat: Infinity,
                        delay: Math.random() * 3
                    }}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        width: '8px',
                        height: '8px',
                        backgroundColor: ['#FF8C00', '#1A1A1D', '#FFD700', '#fff', '#FFA500'][Math.floor(Math.random() * 5)],
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        boxShadow: '0 0 10px rgba(255,140,0,0.3)',
                        zIndex: 0
                    }}
                />
            ))}

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass"
                style={{ maxWidth: '650px', margin: '0 auto', padding: '80px', position: 'relative', zIndex: 10 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                    style={{
                        width: '100px', height: '100px', background: 'linear-gradient(45deg, #00ff00, #008800)',
                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 30px', boxShadow: '0 0 30px rgba(0,255,0,0.3)'
                    }}
                >
                    <span style={{ color: 'white', fontSize: '50px' }}>✓</span>
                </motion.div>

                <h1 style={{ fontSize: '42px', fontWeight: '800', marginBottom: '15px', letterSpacing: '-1.5px' }}>
                    ACQUISITION <span className="text-gradient">COMPLETE.</span>
                </h1>
                <p style={{ fontSize: '18px', color: 'var(--text-muted)', marginBottom: '40px', fontWeight: '500' }}>
                    Your order has been logged into the Shopkart mainframe. Preparation for transit has commenced.
                </p>

                <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/')} className="btn-primary" style={{ padding: '0 40px', height: '55px' }}>
                        CONTINUE EXPLORING
                    </button>
                    <button className="btn-secondary" style={{ padding: '0 40px', height: '55px' }}>
                        VIEW LOGS
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Success;
