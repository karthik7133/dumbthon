import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Signup: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [status, setStatus] = useState('IDLE');
    const [error, setError] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = '/face-models';
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL)
                ]);
                setModelsLoaded(true);
            } catch (err) {
                setError('CORE MODULES UNAVAILABLE.');
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStatus('ENROLLMENT READY');
                }
            })
            .catch(() => setStatus('HARDWARE DISCONNECTED'));
    };

    const handleNextStep = () => {
        if (!formData.name || !formData.email) {
            setError('VALID IDENTIFIERS REQUIRED.');
            return;
        }
        setError('');
        setStep(2);
        setTimeout(startVideo, 200);
    };

    const handleRegister = async () => {
        if (!videoRef.current) return;
        setStatus('ENCODING BIOMETRICS...');
        setError('');

        const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            try {
                const descriptor = Array.from(detection.descriptor);
                const expandRes = await fetch('http://localhost:5000/api/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...formData, faceDescriptor: descriptor })
                });

                const data = await expandRes.json();
                if (!expandRes.ok) throw new Error(data.msg || 'PROTECTION FAULT');

                login(data.user, data.token);

                const stream = videoRef.current.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                navigate('/');
            } catch (err: any) {
                setError(err.message || 'REGISTRATION REJECTED.');
                setStatus('ENROLLMENT FAILED');
            }
        } else {
            setError('SUBJECT LOST. ALIGN FACE TO GRID.');
            setStatus('NO LOCK');
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '15px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        marginBottom: '20px',
        color: 'white',
        fontSize: '15px',
        outline: 'none',
        transition: 'var(--transition)'
    };

    return (
        <div className="auth-container" style={{ minHeight: '80vh', position: 'relative' }}>
            {/* Background Accent */}
            <div style={{
                position: 'absolute', width: '300px', height: '300px', background: 'var(--primary-glow)',
                filter: 'blur(100px)', borderRadius: '50%', zIndex: -1, top: '20%', right: '30%'
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass"
                style={{ width: '100%', maxWidth: '500px', padding: '50px' }}
            >
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <div style={{
                        fontSize: '11px', fontWeight: '800', color: 'var(--primary)',
                        letterSpacing: '3px', marginBottom: '10px'
                    }}>
                        IDENTITY ENROLLMENT v3.0
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>
                        CREATE LOGON
                    </h1>
                </header>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{
                            color: '#ff4d4d', fontSize: '11px', fontWeight: '800', padding: '15px',
                            background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)',
                            borderRadius: '12px', marginBottom: '25px', textAlign: 'center', letterSpacing: '1px'
                        }}
                    >
                        {error}
                    </motion.div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>NAME</label>
                            <input type="text" placeholder="SUBJECT DESIGNATION" style={inputStyle} className="premium-input" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>CONTACT</label>
                            <input type="tel" placeholder="+1 (000) 000-0000" style={inputStyle} className="premium-input" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                            <label style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', letterSpacing: '1px' }}>EMAIL</label>
                            <input type="email" placeholder="ACCESS_ID@SHOPKART.DOM" style={inputStyle} className="premium-input" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                            <button className="btn-primary" style={{ width: '100%', height: '60px', marginTop: '10px' }} onClick={handleNextStep}>
                                INITIALIZE BIOMETRIC LINK
                            </button>

                            <div style={{ marginTop: '30px', textAlign: 'center' }}>
                                <Link to="/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px' }}>
                                    RETURN TO AUTHENTICATE →
                                </Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div style={{
                                position: 'relative', width: '100%', borderRadius: '24px', overflow: 'hidden',
                                border: '1px solid rgba(255,255,255,0.1)', background: '#000',
                                aspectRatio: '4/3', marginBottom: '30px', boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                            }}>
                                {!modelsLoaded ? (
                                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)' }}>
                                        SYNCING CORES...
                                    </div>
                                ) : (
                                    <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />
                                )}

                                {/* Grid HUD */}
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: '1fr 1fr 1fr',
                                    border: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'none'
                                }}>
                                    {[...Array(9)].map((_, i) => <div key={i} style={{ border: '1px solid rgba(255,255,255,0.05)' }} />)}
                                </div>

                                <div style={{
                                    position: 'absolute', bottom: '15px', left: '20px',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <div style={{
                                        width: '8px', height: '8px', borderRadius: '50%',
                                        background: '#00ff00', boxShadow: '0 0 10px #00ff00'
                                    }} />
                                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px', color: 'white' }}>
                                        {status}
                                    </span>
                                </div>
                            </div>

                            <button className="btn-primary" onClick={handleRegister} style={{ width: '100%', height: '60px' }} disabled={!modelsLoaded}>
                                ENROLL BIOMETRICS
                            </button>

                            <button className="btn-secondary" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '15px' }}>
                                EDIT IDENTITIES
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            <style>{`
                .premium-input:focus { 
                    background: rgba(255,255,255,0.06); 
                    border-color: var(--primary);
                    box-shadow: 0 0 15px var(--primary-glow);
                }
            `}</style>
        </div>
    );
};

export default Signup;
