import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Payment: React.FC = () => {
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePayment = () => {
        setIsProcessing(true);
        // Fake processing time
        setTimeout(() => {
            navigate('/success');
        }, 2500);
    };

    return (
        <div className="container" style={{ maxWidth: '800px', padding: '40px 0' }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
            >
                <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', alignItems: 'center' }}>
                    <div style={{ color: '#007600' }}>✔ Address</div>
                    <div style={{ width: '100px', height: '1px', background: '#007600' }}></div>
                    <div style={{ color: '#c45500', fontWeight: 'bold' }}>2. Payment</div>
                    <div style={{ width: '100px', height: '1px', background: '#ddd' }}></div>
                    <div style={{ color: '#555' }}>3. Review</div>
                </div>

                <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Selection a payment method</h1>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '15px', display: 'flex', gap: '15px', background: '#fcfcfc' }}>
                        <input type="radio" name="payment" defaultChecked />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Credit or Debit Card</div>
                            <div style={{ fontSize: '13px', color: '#555' }}>We accept all major cards</div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <input placeholder="Card Number" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 2 }} />
                                <input placeholder="CVV" style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px', flex: 1 }} />
                            </div>
                        </div>
                    </div>

                    <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '15px', display: 'flex', gap: '15px' }}>
                        <input type="radio" name="payment" />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Net Banking</div>
                        </div>
                    </div>

                    <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '15px', display: 'flex', gap: '15px' }}>
                        <input type="radio" name="payment" />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>UPI / Google Pay / PhonePe</div>
                        </div>
                    </div>

                    <div style={{ border: '1px solid #d5d9d9', borderRadius: '8px', padding: '15px', display: 'flex', gap: '15px' }}>
                        <input type="radio" name="payment" />
                        <div>
                            <div style={{ fontWeight: 'bold' }}>Cash on Delivery</div>
                        </div>
                    </div>
                </div>

                {isProcessing ? (
                    <div style={{ textAlign: 'center', marginTop: '30px' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            style={{ width: '40px', height: '40px', border: '4px solid #ddd', borderTopColor: '#e47911', borderRadius: '50%', margin: '0 auto 15px' }}
                        />
                        <div style={{ fontWeight: 'bold', color: '#e47911' }}>Processing Secure Payment...</div>
                        <div style={{ fontSize: '12px', color: '#555' }}>Please do not refresh or go back</div>
                    </div>
                ) : (
                    <button onClick={handlePayment} className="btn-primary" style={{ marginTop: '30px', padding: '12px', width: '100%' }}>
                        Pay and Finish Order
                    </button>
                )}
            </motion.div>
        </div>
    );
};

export default Payment;
