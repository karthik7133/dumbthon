import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        setTimeout(() => {
            navigate('/success');
        }, 2800);
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '60px 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ padding: '60px' }}
            >
                {/* Modern Progress Bar */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '50px', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: '#00ff00', fontWeight: '800', fontSize: '11px', letterSpacing: '2px' }}>✓ ADDRESS</div>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(0,255,0,0.3)' }}></div>
                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '11px', letterSpacing: '2px' }}>PAYMENT</div>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '11px', letterSpacing: '2px' }}>REVIEW</div>
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '35px', letterSpacing: '-1px' }}>SELECT <span className="text-gradient">METHOD.</span></h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {[
                        { id: 'card', title: 'CREDIT / DEBIT CARD', desc: 'INSTANT PROCESSING', active: true },
                        { id: 'net', title: 'NET BANKING', desc: 'SECURE PORTAL REDIRECT' },
                        { id: 'upi', title: 'UPI / DIGITAL WALLET', desc: 'SCAN & PAY' },
                        { id: 'cod', title: 'CASH ON DELIVERY', desc: 'PHYSICAL EXCHANGE' }
                    ].map((m) => (
                        <div key={m.id} style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: `1px solid ${m.active ? 'var(--primary)' : 'rgba(255,255,255,0.1)'}`,
                            borderRadius: '16px', padding: '20px',
                            display: 'flex', gap: '20px', alignItems: 'center',
                            cursor: 'pointer', transition: 'var(--transition)'
                        }}>
                            <input type="radio" name="payment" defaultChecked={m.active} style={{ accentColor: 'var(--primary)', width: '20px', height: '20px' }} />
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: '800', letterSpacing: '1px' }}>{m.title}</div>
                                <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '4px' }}>{m.desc}</div>
                                {m.active && (
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                                        <input placeholder="CARD NUMBER" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'white', flex: 2, fontSize: '12px' }} />
                                        <input placeholder="CVV" style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'white', flex: 1, fontSize: '12px' }} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {isProcessing ? (
                    <div style={{ textAlign: 'center', marginTop: '40px' }}>
                        <motion.div
                            animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{
                                width: '50px', height: '50px',
                                border: '3px solid rgba(255,255,255,0.05)',
                                borderTopColor: 'var(--primary)',
                                borderRadius: '50%', margin: '0 auto 20px',
                                boxShadow: '0 0 20px var(--primary-glow)'
                            }}
                        />
                        <div style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '12px', letterSpacing: '2px' }}>AUTHORIZING TRANSACTION...</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>DO NOT TERMINATE SESSION</div>
                    </div>
                ) : (
                    <button onClick={handlePayment} className="btn-primary" style={{ marginTop: '40px', height: '55px', width: '100%' }}>
                        FINALIZE & PAY
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default Payment;
