import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Address: React.FC = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        fullName: '',
        mobile: '',
        pincode: '',
        houseNo: '',
        area: '',
        city: '',
        state: ''
    });

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        navigate('/payment');
    };

    const inputStyle = {
        width: '100%', padding: '15px', background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
        marginBottom: '20px', color: 'white', outline: 'none'
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '60px 0' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={{ padding: '60px' }}
            >
                {/* Modern Progress Bar */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '50px', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '11px', letterSpacing: '2px' }}>ADDRESS</div>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '11px', letterSpacing: '2px' }}>PAYMENT</div>
                    <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ color: 'var(--text-muted)', fontWeight: '800', fontSize: '11px', letterSpacing: '2px' }}>REVIEW</div>
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '30px', letterSpacing: '-1px' }}>SHIPPING <span className="text-gradient">DESTINATION.</span></h1>

                <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column' }}>
                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>RECIPIENT NAME</label>
                    <input
                        required style={inputStyle}
                        value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    />

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>PHONE</label>
                            <input required style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>PINCODE</label>
                            <input required style={inputStyle} />
                        </div>
                    </div>

                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>FLAT / RESIDENCE</label>
                    <input required style={inputStyle} />

                    <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>AREA / LANDMARK</label>
                    <input required style={inputStyle} />

                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>CITY</label>
                            <input required style={inputStyle} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>STATE / PROVINCE</label>
                            <input required style={inputStyle} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '20px', height: '55px' }}>
                        CONTINUE TO SECURE PAYMENT
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Address;
