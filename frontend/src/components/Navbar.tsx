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
        <nav className="glass" style={{
            height: '80px',
            position: 'sticky',
            top: '20px',
            margin: '0 20px',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            padding: '0 30px',
            marginTop: '20px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '40px' }}>
                {/* Logo */}
                <Link to="/" className="text-gradient" style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    textDecoration: 'none',
                    letterSpacing: '-1.5px'
                }}>
                    SHOPKART
                </Link>

                {/* Search Bar - Modern Redesign */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '12px',
                    padding: '5px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    transition: 'var(--transition)'
                }} className="search-focus">
                    <input
                        type="text"
                        placeholder="Search for perfection..."
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            padding: '10px 15px',
                            fontSize: '15px',
                            flex: 1,
                            outline: 'none'
                        }}
                    />
                    <button style={{
                        background: 'linear-gradient(45deg, #FF8C00, #FFA500)',
                        border: 'none',
                        borderRadius: '8px',
                        width: '45px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(255, 140, 0, 0.3)'
                    }}>
                        <span style={{ fontSize: '18px' }}>🔍</span>
                    </button>
                </div>

                {/* Nav Links */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                    <div style={{ position: 'relative' }}>
                        {user ? (
                            <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }} onClick={handleLogout}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>WELCOME,</span>
                                <span style={{ fontSize: '14px', fontWeight: '700' }}>{user.name.toUpperCase()}</span>
                            </div>
                        ) : (
                            <Link to="/login" style={{ textDecoration: 'none', color: 'white' }}>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>GUEST,</span>
                                <span style={{ fontSize: '14px', fontWeight: '700', display: 'block' }}>SIGN IN</span>
                            </Link>
                        )}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600' }}>HISTORY,</span>
                        <span style={{ fontSize: '14px', fontWeight: '700' }}>ORDERS</span>
                    </div>

                    {/* Cart with Glow */}
                    <Link to="/cart" style={{ textDecoration: 'none', color: 'white', position: 'relative' }}>
                        <div style={{
                            background: 'rgba(255,255,255,0.05)',
                            padding: '10px 15px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <span style={{ fontSize: '20px' }}>🛒</span>
                            <motion.span
                                key={cartCount}
                                initial={{ scale: 1.5, color: '#FFD700' }}
                                animate={{ scale: 1, color: '#fff' }}
                                style={{ fontWeight: '800', fontSize: '16px' }}
                            >
                                {cartCount}
                            </motion.span>
                        </div>
                    </Link>
                </div>
            </div>

            <style>{`
                .search-focus:focus-within { 
                    box-shadow: 0 0 0 3px var(--primary-glow);
                    border-color: var(--primary);
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
