import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="container" style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '20px' }}>
                {/* Logo */}
                <Link to="/" className="nav-logo" style={{ flexShrink: 0 }}>
                    Shopkart
                </Link>

                {/* Search */}
                <div className="nav-search">
                    <select style={{ background: '#f3f3f3', border: 'none', borderRight: '1px solid #ddd', padding: '0 10px', fontSize: '12px', cursor: 'pointer' }}>
                        <option>All Departments</option>
                    </select>
                    <input type="text" placeholder="Search for products, brands and more" />
                    <button>
                        <span style={{ fontSize: '18px' }}>🔍</span>
                    </button>
                </div>

                {/* Right Items */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', height: '100%' }}>

                    {/* User Account */}
                    <div className="nav-item" style={{ color: 'white', padding: '8px 10px', borderRadius: '4px', cursor: 'pointer' }}>
                        {user ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', color: '#ccc' }}>Hello, {user.name}</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold' }} onClick={handleLogout}>Account & Logout</span>
                            </div>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '12px', color: '#ccc' }}>Hello, sign in</span>
                                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Account & Lists</span>
                            </Link>
                        )}
                    </div>

                    {/* Orders */}
                    <div className="nav-item" style={{ color: 'white', padding: '8px 10px', borderRadius: '4px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '12px', color: '#ccc' }}>Returns</span>
                        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>& Orders</span>
                    </div>

                    {/* Cart */}
                    <Link to="/cart" className="nav-item" style={{ textDecoration: 'none', color: 'white', padding: '8px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ position: 'relative' }}>
                            <span style={{ fontSize: '24px' }}>🛒</span>
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 1.5, color: '#ff9900' }}
                                animate={{ scale: 1, color: '#f08804' }}
                                style={{
                                    position: 'absolute', top: '-8px', left: '10px',
                                    fontWeight: 'bold', fontSize: '15px'
                                }}
                            >
                                {cartCount}
                            </motion.span>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 'bold', marginTop: '10px' }}>Cart</span>
                    </Link>
                </div>
            </div>

            <style>{`
                .nav-item:hover { outline: 1px solid white; }
                .nav-search button:hover { background: #f3a847; }
            `}</style>
        </nav>
    );
};

export default Navbar;
