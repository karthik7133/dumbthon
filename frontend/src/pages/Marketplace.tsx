import React, { useEffect, useState } from 'react';
import { getItems } from '../services/api';
import RunningCartButton from '../components/RunningCartButton';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

interface MarketplaceProps {
    user: any;
}

const Marketplace: React.FC<MarketplaceProps> = ({ user }) => {
    const [items, setItems] = useState<any[]>([]);
    const { addToCart } = useCart();

    const dummyProducts = [
        { _id: 'd1', title: 'AURA SOUND - G5', description: 'Next-gen smart audio experience with localized deep bass.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', price: 149.99, rating: 4.9, category: 'ELITE SOUND' },
        { _id: 'd2', title: 'ZEN CANCEL PRO', description: 'Ultimate silence. Pure sound. 50-hour battery life.', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', price: 429.00, rating: 4.8, category: 'ELITE SOUND' },
        { _id: 'd3', title: 'CHRONOS SERIES 9', description: 'Timeless design meeting future tech. Ceramic finish.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', price: 899.00, rating: 5.0, category: 'WEARABLES' },
        { _id: 'd4', title: 'LUMINA READER', description: 'Paper-like clarity. Infinite library. Anti-glare 120Hz.', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80', price: 299.99, rating: 4.7, category: 'DEVICES' },
        { _id: 'd5', title: 'HORIZON OLED ULTRA', description: 'Unbounded immersion. 240Hz OLED perfection.', image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=800&q=80', price: 1499.99, rating: 4.9, category: 'ELITE VISUALS' },
        { _id: 'd6', title: 'SONIC BUDS ELITE', description: 'Spatial audio. Unmatched comfort. 10mm drivers.', image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', price: 249.00, rating: 4.8, category: 'ELITE SOUND' },
        { _id: 'd7', title: 'MX PRECISION 4', description: 'Flow across devices. Infinite scroll. Silent clicks.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', price: 129.00, rating: 4.7, category: 'PRODUCTIVITY' },
        { _id: 'd8', title: 'NEON SWITCH OLED', description: 'Play anywhere. Vibrant screen. Enhanced dock.', image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?w=800&q=80', price: 399.99, rating: 4.9, category: 'GAMING' },
        { _id: 'd9', title: 'VORTEX V10 ULTRA', description: 'Cordless power. HEPA filtration. Laser detection.', image: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800&q=80', price: 599.00, rating: 4.6, category: 'HOME TECH' },
        { _id: 'd10', title: 'BREW MASTER ELITE', description: 'Professional grade espresso. Single touch.', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&q=80', price: 199.99, rating: 4.7, category: 'HOME TECH' },
        { _id: 'd11', title: 'AETHER FLASK 2', description: 'Titanium build. Temp lock for 48 hours.', image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80', price: 89.95, rating: 4.9, category: 'LIFESTYLE' },
        { _id: 'd12', title: 'VITALITY TRACKER', description: 'Advanced metrics. Metabolic tracking. AI insights.', image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b0?w=800&q=80', price: 199.95, rating: 4.4, category: 'WEARABLES' },
        { _id: 'd13', title: 'NOIR DENIM ELITE', description: 'Handcrafted Japanese denim. Tailored fit.', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80', price: 159.50, rating: 4.6, category: 'FASHION' },
        { _id: 'd14', title: 'STRIDE PRO RUNNER', description: 'Zero gravity foam. Carbon fiber plate.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80', price: 220.00, rating: 4.8, category: 'FASHION' },
        { _id: 'd15', title: 'ALPHA CINEMA S4', description: 'Full-frame raw. 8K internal. Global shutter.', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80', price: 3499.00, rating: 4.9, category: 'CREATIVE ELITE' },
        { _id: 'd16', title: 'STELLAR DUO 9', description: 'Pressure cook. Air fry. Infinit-sync app.', image: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=800&q=80', price: 299.95, rating: 4.8, category: 'HOME TECH' }
    ];

    useEffect(() => {
        loadItems();
    }, []);

    const loadItems = async () => {
        try {
            const res = await getItems();
            if (res.data && res.data.length > 0) {
                setItems([...dummyProducts, ...res.data]);
            } else {
                setItems(dummyProducts);
            }
        } catch (e) {
            setItems(dummyProducts);
        }
    };

    const renderStars = (rating: number = 4.5) => {
        const fullStars = Math.floor(rating);
        return (
            <div style={{ color: 'var(--accent)', fontSize: '14px', margin: '8px 0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                {'★'.repeat(fullStars)}{'☆'.repeat(5 - fullStars)}
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: '8px', fontWeight: '500' }}>
                    ({Math.floor(Math.random() * 9000) + 1000} reviews)
                </span>
            </div>
        );
    }

    // Dynamic Blobs for Background
    const blobs = [
        { size: '400px', bg: 'rgba(255, 140, 0, 0.05)', top: '-100px', left: '-50px', duration: 25 },
        { size: '500px', bg: 'rgba(26, 26, 29, 0.4)', top: '40%', right: '-100px', duration: 30 },
        { size: '300px', bg: 'rgba(255, 215, 0, 0.05)', bottom: '10%', left: '20%', duration: 20 },
    ];

    const BackgroundParticles = () => {
        const particles = Array.from({ length: 15 });
        return (
            <div className="particle-container">
                {particles.map((_, i) => (
                    <div
                        key={i}
                        className={`particle ${i % 3 === 0 ? 'star' : ''}`}
                        style={{
                            width: `${Math.random() * 8 + 4}px`,
                            height: `${Math.random() * 8 + 4}px`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${Math.random() * 10 + 15}s`,
                            animationDelay: `${Math.random() * 10}s`,
                            opacity: Math.random() * 0.15 + 0.05
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <div style={{ position: 'relative', overflow: 'visible' }}>
            <BackgroundParticles />
            {/* Background Blobs */}
            {blobs.map((blob, i) => (
                <motion.div
                    key={i}
                    animate={{
                        x: [0, 50, -50, 0],
                        y: [0, -50, 50, 0],
                        scale: [1, 1.1, 0.9, 1]
                    }}
                    transition={{
                        duration: blob.duration,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    style={{
                        position: 'fixed',
                        width: blob.size,
                        height: blob.size,
                        background: blob.bg,
                        filter: 'blur(80px)',
                        borderRadius: '50%',
                        zIndex: -1,
                        top: (blob as any).top,
                        left: (blob as any).left,
                        right: (blob as any).right,
                        bottom: (blob as any).bottom,
                    }}
                />
            ))}

            <div className="container" style={{ padding: '60px 0' }}>
                <header style={{ marginBottom: '60px' }}>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ fontSize: '48px', fontWeight: '800', letterSpacing: '-1px', marginBottom: '10px' }}
                    >
                        DESIGNED FOR <span className="text-gradient">EXCELLENCE.</span>
                    </motion.h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '18px', fontWeight: '500' }}>
                        Welcome back, {user.name}. Curated just for you.
                    </p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                    {items.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.02 }}
                            className="glass"
                            style={{
                                padding: '30px',
                                display: 'flex',
                                flexDirection: 'column',
                                background: 'rgba(255,255,255,0.02)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                overflow: 'visible' // Ensure buttons can escape visually
                            }}
                        >
                            <div style={{
                                height: '240px',
                                width: '100%',
                                marginBottom: '25px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                position: 'relative'
                            }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                        objectFit: 'contain',
                                        filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))'
                                    }}
                                />
                            </div>

                            <div style={{ flex: 1 }}>
                                <div style={{
                                    textTransform: 'uppercase',
                                    fontSize: '11px',
                                    fontWeight: '800',
                                    color: 'var(--primary)',
                                    letterSpacing: '2px',
                                    marginBottom: '8px'
                                }}>
                                    {item.category || 'FEATURED'}
                                </div>
                                <h3 style={{
                                    fontSize: '18px',
                                    margin: '0 0 10px 0',
                                    fontWeight: '700',
                                    color: 'white',
                                    lineHeight: '1.3'
                                }}>
                                    {item.title}
                                </h3>
                                {renderStars(item.rating)}
                                <div style={{ fontSize: '28px', fontWeight: '800', margin: '15px 0' }}>
                                    <span style={{ fontSize: '16px', verticalAlign: 'top', color: 'var(--primary)', marginRight: '4px' }}>$</span>
                                    {Math.floor(item.price)}
                                    <span style={{ fontSize: '16px', verticalAlign: 'top', opacity: 0.6 }}>.99</span>
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '20px' }}>
                                    {item.description}
                                </p>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <RunningCartButton onAdd={() => addToCart(item)} />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Marketplace;
