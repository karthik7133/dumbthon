import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';

const METHODS = [
    { id: 'card', label: 'CREDIT / DEBIT CARD', desc: 'INSTANT PROCESSING', icon: '💳' },
    { id: 'upi', label: 'UPI / DIGITAL WALLET', desc: 'SCAN & PAY', icon: '📱' },
    { id: 'net', label: 'NET BANKING', desc: 'SECURE PORTAL REDIRECT', icon: '🏦' },
    { id: 'cod', label: 'CASH ON DELIVERY', desc: 'PAY ON ARRIVAL', icon: '💵' },
];

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const { cart, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const [method, setMethod] = useState('card');
    const [isProcessing, setProcessing] = useState(false);
    const [error, setError] = useState('');

    const handlePayment = async () => {
        setProcessing(true);
        setError('');
        try {
            const address = JSON.parse(sessionStorage.getItem('shopkart_address') || '{}');
            const items = cart.map(ci => ({
                itemId: ci.item._id,
                title: ci.item.title,
                image: ci.item.image,
                price: ci.item.price,
                category: ci.item.category,
                quantity: ci.quantity,
            }));
            await placeOrder({ userId: user._id, items, total: cartTotal, address, paymentMethod: method });
            clearCart();
            sessionStorage.removeItem('shopkart_address');
            setTimeout(() => navigate('/success'), 1800);
        } catch (err: any) {
            setError(err?.response?.data?.error || 'Payment failed. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '60px 0' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass" style={{ padding: '60px' }}>
                {/* Progress */}
                <div style={{ display: 'flex', gap: '12px', marginBottom: '50px', alignItems: 'center', justifyContent: 'center' }}>
                    {['ADDRESS', 'PAYMENT', 'DONE'].map((s, i) => (
                        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                                <div style={{
                                    width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: i === 0 ? 'rgba(0,230,118,0.15)' : i === 1 ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                                    border: i === 0 ? '1px solid rgba(0,230,118,0.4)' : i === 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '11px', fontWeight: '800',
                                    color: i === 0 ? 'var(--success)' : i === 1 ? '#fff' : 'var(--text-muted)'
                                }}>{i === 0 ? '✓' : i + 1}</div>
                                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: i === 0 ? 'var(--success)' : i === 1 ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
                            </div>
                            {i < 2 && <div style={{ width: '40px', height: '1px', background: i === 0 ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.08)' }} />}
                        </div>
                    ))}
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '36px', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
                    Select <span className="text-gradient">Payment.</span>
                </h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                    {METHODS.map(m => (
                        <div
                            key={m.id}
                            onClick={() => setMethod(m.id)}
                            style={{
                                background: method === m.id ? 'rgba(255,140,0,0.06)' : 'rgba(255,255,255,0.02)',
                                border: `1px solid ${method === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                                borderRadius: '14px', padding: '18px 22px',
                                display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer',
                                transition: 'var(--transition)',
                                boxShadow: method === m.id ? '0 0 20px rgba(255,140,0,0.1)' : 'none',
                            }}
                        >
                            <span style={{ fontSize: '22px' }}>{m.icon}</span>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '1px' }}>{m.label}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '3px' }}>{m.desc}</div>
                            </div>
                            <div style={{
                                width: '18px', height: '18px', borderRadius: '50%',
                                border: `2px solid ${method === m.id ? 'var(--primary)' : 'rgba(255,255,255,0.2)'}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {method === m.id && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)' }} />}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order total summary */}
                <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '18px 22px', marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>ORDER TOTAL ({cart.reduce((s, c) => s + c.quantity, 0)} items)</span>
                    <span style={{ fontSize: '24px', fontWeight: '800' }}><span style={{ color: 'var(--primary)', verticalAlign: 'super', fontSize: '12px' }}>$</span>{cartTotal.toFixed(2)}</span>
                </div>

                {error && <div className="alert-error" style={{ marginBottom: '20px' }}><span>⚠</span> {error}</div>}

                {isProcessing ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ width: '48px', height: '48px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 16px', boxShadow: '0 0 20px var(--primary-glow)' }}
                        />
                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '12px', letterSpacing: '2px' }}>AUTHORIZING TRANSACTION...</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>Saving your order to the database</div>
                    </div>
                ) : (
                    <button onClick={handlePayment} className="btn-primary" style={{ height: '56px', width: '100%', fontSize: '13px', letterSpacing: '2px' }}>
                        ⚡ FINALIZE & PAY ${cartTotal.toFixed(2)}
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default Payment;
