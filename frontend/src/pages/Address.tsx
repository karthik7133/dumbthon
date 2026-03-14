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
        // Just proceed to payment
        navigate('/payment');
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '40px 0' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
            >
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'center' }}>
                    <div style={{ color: '#c45500', fontWeight: 'bold' }}>1. Address</div>
                    <div style={{ width: '100px', height: '1px', background: '#ddd' }}></div>
                    <div style={{ color: '#555' }}>2. Payment</div>
                    <div style={{ width: '100px', height: '1px', background: '#ddd' }}></div>
                    <div style={{ color: '#555' }}>3. Review</div>
                </div>

                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Select a delivery address</h1>

                <form onSubmit={handleContinue} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Full name (First and Last name)</label>
                        <input
                            required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }}
                            value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Mobile number</label>
                            <input required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Pincode</label>
                            <input required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Flat, House no., Building, Company, Apartment</label>
                        <input required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Area, Colony, Street, Sector, Village</label>
                        <input required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>Town/City</label>
                            <input required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' }}>State</label>
                            <input required style={{ width: '100%', padding: '8px', border: '1px solid #d5d9d9', borderRadius: '4px' }} />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ marginTop: '20px', padding: '12px' }}>
                        Use this address and continue to Payment
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Address;
