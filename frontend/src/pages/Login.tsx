import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { faceUnlock } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState('SYSTEM READY');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
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
                setLoading(false);
                startVideo();
            } catch (err) {
                setStatus('HARDWARE FAILURE');
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(() => setStatus('CAMERA ERROR'));
    };

    const handleScan = async () => {
        if (!videoRef.current) return;
        setStatus('SCANNING...');
        setError('');

        const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            try {
                const descriptor = Array.from(detection.descriptor);
                const res = await faceUnlock(descriptor);
                login(res.data.user, res.data.token);

                const stream = videoRef.current.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                navigate('/');
            } catch (err: any) {
                setError('ID MISMATCH. ACCESS DENIED.');
                setStatus('MATCH FAILED');
            }
        } else {
            setError('SUBJECT NOT FOUND. ENSURE CLEAR VIEW.');
            setStatus('NO SIGNAL');
        }
    };

    return (
        <div className="auth-container" style={{ minHeight: '80vh', position: 'relative' }}>
            {/* Background Accent */}
            <div style={{
                position: 'absolute', width: '300px', height: '300px', background: 'var(--primary-glow)',
                filter: 'blur(100px)', borderRadius: '50%', zIndex: -1, top: '20%', left: '30%'
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass"
                style={{ width: '100%', maxWidth: '480px', padding: '50px' }}
            >
                <header style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <div style={{
                        fontSize: '12px', fontWeight: '800', color: 'var(--primary)',
                        letterSpacing: '3px', marginBottom: '10px'
                    }}>
                        SECURE LOGON SYSTEM v3.0
                    </div>
                    <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-1px' }}>
                        AUTHENTICATE
                    </h1>
                </header>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                            style={{
                                width: '40px', height: '40px', border: '2px solid rgba(255,255,255,0.1)',
                                borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 20px'
                            }}
                        />
                        <div style={{ fontSize: '11px', fontWeight: '800', letterSpacing: '2px', color: 'var(--text-muted)' }}>
                            INITIALIZING...
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{
                            position: 'relative', width: '100%', borderRadius: '24px', overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.1)', background: '#000',
                            aspectRatio: '4/3', marginBottom: '30px', boxShadow: '0 0 40px rgba(0,0,0,0.5)'
                        }}>
                            <video ref={videoRef} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }} />

                            {/* Scanning HUD */}
                            <motion.div
                                animate={{ top: ['0%', '98%', '0%'] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                style={{
                                    position: 'absolute', left: 0, right: 0, height: '2px',
                                    background: 'linear-gradient(to right, transparent, var(--primary), transparent)',
                                    boxShadow: '0 0 15px var(--primary)', zIndex: 5
                                }}
                            />

                            <div style={{
                                position: 'absolute', bottom: '15px', left: '20px',
                                display: 'flex', alignItems: 'center', gap: '8px'
                            }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: status.includes('ERROR') || status.includes('FAILED') ? '#ff4d4d' : '#00ff00',
                                    boxShadow: `0 0 10px ${status.includes('ERROR') || status.includes('FAILED') ? '#ff4d4d' : '#00ff00'}`
                                }} />
                                <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px', color: 'white' }}>
                                    {status}
                                </span>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                style={{
                                    color: '#ff4d4d', fontSize: '11px', fontWeight: '700', padding: '15px',
                                    background: 'rgba(255, 77, 77, 0.1)', border: '1px solid rgba(255, 77, 77, 0.2)',
                                    borderRadius: '12px', marginBottom: '25px', textAlign: 'center', letterSpacing: '0.5px'
                                }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button className="btn-primary" onClick={handleScan} style={{ width: '100%', height: '60px' }}>
                            RUN BIOMETRIC SCAN
                        </button>
                    </>
                )}

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '15px', fontWeight: '500' }}>
                        NEW SUBJECT?
                    </div>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ width: '100%', fontSize: '13px', letterSpacing: '1px', fontWeight: '800' }}>
                            ENROLL NEW IDENTITY
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
