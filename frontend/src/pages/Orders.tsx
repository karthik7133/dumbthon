import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../services/api';

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
    confirmed: { label: 'Confirmed', color: '#00E676', bg: 'rgba(0,230,118,0.1)' },
    shipped: { label: 'Shipped', color: '#4FC3F7', bg: 'rgba(79,195,247,0.1)' },
    delivered: { label: 'Delivered', color: '#FFD700', bg: 'rgba(255,215,0,0.1)' },
    pending: { label: 'Pending', color: '#FF8C00', bg: 'rgba(255,140,0,0.1)' },
};

const Orders: React.FC = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        if (!user?._id) return;
        getOrders(user._id)
            .then(res => setOrders(res.data.orders || []))
            .catch(() => setOrders([]))
            .finally(() => setLoading(false));
    }, [user]);

    return (
        <div className="container" style={{ padding: '60px 0', minHeight: '80vh' }}>
            <header style={{ marginBottom: '48px' }}>
                <div className="text-label" style={{ marginBottom: '10px' }}>ACCOUNT</div>
                <h1 style={{ fontSize: '40px', fontWeight: '800', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
                    Order <span className="text-gradient">History.</span>
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginTop: '8px' }}>
                    {orders.length === 0 && !loading ? "No orders yet — start exploring!" : `${orders.length} order${orders.length !== 1 ? 's' : ''} placed`}
                </p>
            </header>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '80px 0' }}>
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        style={{ width: '44px', height: '44px', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px' }}
                    />
                    <div style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600', letterSpacing: '1px' }}>LOADING ORDER HISTORY...</div>
                </div>
            ) : orders.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '80px', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px', opacity: 0.2 }}>📦</div>
                    <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>No Orders Yet</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '28px', fontSize: '15px' }}>Items you order will appear here with their status and details.</p>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <button className="btn-primary" style={{ padding: '0 40px', height: '52px' }}>Browse Products</button>
                    </Link>
                </motion.div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {orders.map((order, idx) => {
                        const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
                        const isOpen = expanded === order._id;
                        const date = new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                        return (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.06 }}
                                className="glass"
                                style={{ overflow: 'hidden' }}
                            >
                                {/* Order header — always visible */}
                                <div
                                    onClick={() => setExpanded(isOpen ? null : order._id)}
                                    style={{ padding: '24px 28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px' }}
                                >
                                    {/* Status indicator */}
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: cfg.color, boxShadow: `0 0 12px ${cfg.color}`, flexShrink: 0 }} />

                                    {/* Order details */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                                            <span style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-display)' }}>{order.orderId}</span>
                                            <span style={{ fontSize: '11px', fontWeight: '700', padding: '3px 10px', borderRadius: '100px', background: cfg.bg, color: cfg.color }}>
                                                {cfg.label}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>
                                            {date} · {order.items.length} item{order.items.length !== 1 ? 's' : ''} · <span style={{ color: 'var(--primary)', fontWeight: '700' }}>${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Thumbnails */}
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {order.items.slice(0, 3).map((it: any, i: number) => (
                                            <div key={i} style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                {it.image
                                                    ? <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '4px' }} />
                                                    : <span style={{ fontSize: '18px' }}>📦</span>}
                                            </div>
                                        ))}
                                        {order.items.length > 3 && <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: 'var(--text-muted)' }}>+{order.items.length - 3}</div>}
                                    </div>

                                    <div style={{ color: 'var(--text-muted)', fontSize: '18px', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }}>⌄</div>
                                </div>

                                {/* Expanded detail */}
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.25 }}
                                            style={{ overflow: 'hidden' }}
                                        >
                                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 28px' }}>
                                                {/* Items */}
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                                                    {order.items.map((it: any, i: number) => (
                                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                                                                {it.image ? <img src={it.image} alt={it.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '6px' }} /> : <span>📦</span>}
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ fontSize: '14px', fontWeight: '700' }}>{it.title}</div>
                                                                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>Qty: {it.quantity} · ${it.price.toFixed(2)} each</div>
                                                            </div>
                                                            <div style={{ fontWeight: '800', fontSize: '15px' }}>${(it.price * it.quantity).toFixed(2)}</div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Address & Total row */}
                                                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                                    {order.address?.city && (
                                                        <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px' }}>
                                                            <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>DELIVERED TO</div>
                                                            <div style={{ fontSize: '13px', fontWeight: '600', lineHeight: 1.6 }}>
                                                                {order.address.fullName}<br />
                                                                {order.address.houseNo}, {order.address.area}<br />
                                                                {order.address.city}, {order.address.state} — {order.address.pincode}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div style={{ flex: 1, minWidth: '200px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px' }}>
                                                        <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px' }}>ORDER SUMMARY</div>
                                                        <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', justifyContent: 'space-between' }}>
                                                            <span>Payment</span><span style={{ color: 'white', textTransform: 'uppercase' }}>{order.paymentMethod}</span>
                                                        </div>
                                                        <div style={{ fontSize: '16px', fontWeight: '800', display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                                                            <span>Total</span><span style={{ color: 'var(--primary)' }}>${order.total.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Orders;
