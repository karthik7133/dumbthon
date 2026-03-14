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
        { _id: 'd1', title: 'Echo Dot (5th Gen)', description: 'Smart speaker with Alexa | Charcoal', image: 'https://m.media-amazon.com/images/I/71C3oJLMM1L._AC_SL1000_.jpg', price: 49.99, rating: 4.7, category: 'Electronics' },
        { _id: 'd2', title: 'Sony WH-1000XM5', description: 'Wireless Noise Canceling Headphones', image: 'https://m.media-amazon.com/images/I/41JACWT-wWL._AC_SL1000_.jpg', price: 398.00, rating: 4.6, category: 'Electronics' },
        { _id: 'd3', title: 'Apple Watch Series 9', description: 'Smartwatch with Midnight Aluminum Case', image: 'https://m.media-amazon.com/images/I/71xeyL011eL._AC_SL1500_.jpg', price: 399.00, rating: 4.8, category: 'Electronics' },
        { _id: 'd4', title: 'Kindle Paperwhite', description: '8 GB, now with a 6.8" display', image: 'https://m.media-amazon.com/images/I/51QCxbpsuHL._AC_SL1000_.jpg', price: 139.99, rating: 4.7, category: 'Electronics' },
        { _id: 'd5', title: 'SAMSUNG 49" Odyssey OLED G9', description: 'G95SC Series Curved Smart Gaming Monitor', image: 'https://m.media-amazon.com/images/I/81IhwzJ7O3L._AC_SL1500_.jpg', price: 1199.99, rating: 4.4, category: 'Electronics' },
        { _id: 'd6', title: 'Apple AirPods Pro (2nd Gen)', description: 'Wireless Earbuds with USB-C Charging', image: 'https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg', price: 189.00, rating: 4.8, category: 'Electronics' },
        { _id: 'd7', title: 'Logitech MX Master 3S', description: 'Wireless Performance Mouse', image: 'https://m.media-amazon.com/images/I/61x2E5B1kGL._AC_SL1500_.jpg', price: 99.00, rating: 4.6, category: 'Electronics' },
        { _id: 'd8', title: 'Nintendo Switch - OLED Model', description: 'w/ White Joy-Con', image: 'https://m.media-amazon.com/images/I/51yJ+OqGHQL._AC_SL1200_.jpg', price: 349.99, rating: 4.9, category: 'Electronics' },
        { _id: 'd9', title: 'Dyson V8 Cordless Vacuum', description: 'Cleaner, Extra Tools, Silver/Nickel', image: 'https://m.media-amazon.com/images/I/51D8z25TzLL._AC_SL1500_.jpg', price: 349.00, rating: 4.5, category: 'Home' },
        { _id: 'd10', title: 'Keurig K-Mini', description: 'Single Serve K-Cup Pod Coffee Maker', image: 'https://m.media-amazon.com/images/I/719PscB310L._AC_SL1500_.jpg', price: 59.99, rating: 4.6, category: 'Home' },
        { _id: 'd11', title: 'Hydro Flask Water Bottle', description: 'Stainless Steel & Vacuum Insulated', image: 'https://m.media-amazon.com/images/I/61vK-L7LpGL._AC_SL1500_.jpg', price: 44.95, rating: 4.8, category: 'Sports' },
        { _id: 'd12', title: 'Fitbit Charge 6', description: 'Fitness Tracker with Google apps', image: 'https://m.media-amazon.com/images/I/61T040DndfL._AC_SL1500_.jpg', price: 159.95, rating: 4.3, category: 'Sports' },
        { _id: 'd13', title: 'Levi\'s Men\'s 501 Original Fit Jeans', description: '100% Cotton, Zipper closure', image: 'https://m.media-amazon.com/images/I/815yvIdhTKL._AC_SX679_.jpg', price: 59.50, rating: 4.5, category: 'Fashion' },
        { _id: 'd14', title: 'Adidas Samba OG Shoes', description: 'Cloud White / Core Black / Gum', image: 'https://m.media-amazon.com/images/I/61U08S607XL._AC_SY695_.jpg', price: 100.00, rating: 4.7, category: 'Fashion' },
        { _id: 'd15', title: 'Sony Alpha a7 IV Mirrorless Camera', description: 'Full-frame Mirrorless Interchangeable Lens Camera', image: 'https://m.media-amazon.com/images/I/71m6R5pM2FL._AC_SL1500_.jpg', price: 2498.00, rating: 4.8, category: 'Electronics' },
        { _id: 'd16', title: 'Instant Pot Duo 7-in-1', description: 'Electric Pressure Cooker, Slow Cooker, Rice Cooker', image: 'https://m.media-amazon.com/images/I/71WtwEvY85L._AC_SL1500_.jpg', price: 99.95, rating: 4.7, category: 'Home' }
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
            <div style={{ color: '#ffa41c', fontSize: '16px', margin: '4px 0', display: 'flex', alignItems: 'center', gap: '2px' }}>
                {'★'.repeat(fullStars)}{'☆'.repeat(5 - fullStars)}
                <span style={{ fontSize: '13px', color: '#007185', marginLeft: '5px' }}>{Math.floor(Math.random() * 8000) + 500}</span>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            {/* Hero Banner */}
            <div style={{
                width: '100%',
                height: '350px',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(234,237,237,1)), url("https://m.media-amazon.com/images/I/71Ie3JXG9VL._SX3000_.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative',
                marginBottom: '-150px'
            }}>
                <div className="container" style={{ padding: '40px 0' }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        style={{ maxWidth: '450px', color: 'black' }}
                    >
                        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' }}>Holiday Deals are Here</h1>
                        <p style={{ fontSize: '18px' }}>Shop our biggest sale of the year with up to 70% off on premium electronics and fashion.</p>
                        <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>Explore Now</button>
                    </motion.div>
                </div>
            </div>

            <div className="container" style={{ position: 'relative', zIndex: 10 }}>
                {/* Product Categories Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                    {items.map((item, index) => (
                        <motion.div
                            key={item._id || index}
                            whileHover={{ scale: 1.02 }}
                            className="product-card"
                            style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ height: '200px', width: '100%', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', mixBlendMode: 'multiply' }}>
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', color: '#555' }}>
                                    {item.category || 'Featured'}
                                </span>
                                <h3 style={{ fontSize: '16px', margin: '8px 0 5px 0', fontWeight: '600', color: 'var(--text-color)', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                    {item.title}
                                </h3>
                                {renderStars(item.rating)}
                                <div style={{ fontSize: '24px', fontWeight: '600', margin: '10px 0' }}>
                                    <span style={{ fontSize: '14px', verticalAlign: 'top', marginRight: '2px' }}>$</span>
                                    {Math.floor(item.price)}
                                    <span style={{ fontSize: '14px', verticalAlign: 'top' }}>{(item.price % 1).toFixed(2).substring(1)}</span>
                                </div>
                                <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                                    Get it by <strong>Tomorrow, Mar 15</strong>
                                </div>
                            </div>
                            <div style={{ marginTop: '20px' }}>
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
