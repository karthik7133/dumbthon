import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Address: React.FC = () => {
    const navigate = useNavigate();
    const [address, setAddress] = useState({
        fullName: '', phone: '', pincode: '', houseNo: '', area: '', city: '', state: ''
    });

    const handleContinue = (e: React.FormEvent) => {
        e.preventDefault();
        // Store address in sessionStorage so Payment page can read it
        sessionStorage.setItem('shopkart_address', JSON.stringify(address));
        navigate('/payment');
    };

    const field = (label: string, key: keyof typeof address, placeholder = '', type = 'text', flex?: number) => (
        <div style={{ flex: flex ?? 1 }}>
            <label className="form-label">{label}</label>
            <input
                type={type}
                required
                placeholder={placeholder}
                className="form-input"
                style={{ marginBottom: '20px' }}
                value={address[key]}
                onChange={e => setAddress({ ...address, [key]: e.target.value })}
            />
        </div>
    );

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
                                    background: i === 0 ? 'var(--primary)' : 'rgba(255,255,255,0.08)',
                                    border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                    fontSize: '11px', fontWeight: '800', color: i === 0 ? '#fff' : 'var(--text-muted)'
                                }}>{i + 1}</div>
                                <span style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '1.5px', color: i === 0 ? 'var(--primary)' : 'var(--text-muted)' }}>{s}</span>
                            </div>
                            {i < 2 && <div style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.08)' }} />}
                        </div>
                    ))}
                </div>

                <h1 style={{ fontSize: '32px', fontWeight: '800', marginBottom: '36px', letterSpacing: '-1px', fontFamily: 'var(--font-display)' }}>
                    Shipping <span className="text-gradient">Destination.</span>
                </h1>

                <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    {field('Recipient Name', 'fullName', 'Full name')}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {field('Phone', 'phone', '+91 00000 00000', 'tel')}
                        {field('Pincode', 'pincode', '000 000', 'text')}
                    </div>
                    {field('Flat / House No.', 'houseNo', 'Apartment, suite, unit etc.')}
                    {field('Area / Landmark', 'area', 'Street, locality, landmark')}
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {field('City', 'city', 'City')}
                        {field('State', 'state', 'State / Province')}
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '12px', height: '56px', fontSize: '13px', letterSpacing: '2px' }}>
                        Continue to Payment →
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Address;
