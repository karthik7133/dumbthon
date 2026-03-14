import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Signup: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [status, setStatus] = useState('Initializing Scanner...');
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
                setError('Biometric sensors unavailable.');
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setStatus('Ready for Face Enrollment');
                }
            })
            .catch(() => setStatus('Camera access denied.'));
    };

    const handleNextStep = () => {
        if (!formData.name || !formData.email) {
            setError('Please fill in your name and email correctly.');
            return;
        }
        setError('');
        setStep(2);
        setTimeout(startVideo, 200);
    };

    const handleRegister = async () => {
        if (!videoRef.current) return;
        setStatus('Analyzing Curated Biometrics...');
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
                if (!expandRes.ok) throw new Error(data.msg || 'Enrollment failed');

                login(data.user, data.token);

                const stream = videoRef.current.srcObject as MediaStream;
                stream?.getTracks().forEach(track => track.stop());
                navigate('/');
            } catch (err: any) {
                setError(err.message || 'Face enrollment failed. Please try again.');
                setStatus('Ready for Face Enrollment');
            }
        } else {
            setError('No face detected. Look directly at the camera and ensure good lighting.');
            setStatus('Failure: No Face Detected');
        }
    };

    const labelStyle = { display: 'block', fontWeight: 'bold', fontSize: '13px', marginBottom: '5px' };
    const inputStyle = { width: '100%', padding: '10px', border: '1px solid #d5d9d9', borderRadius: '4px', marginBottom: '15px', fontSize: '14px' };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card auth-card"
            >
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '25px' }}>Create account</h1>

                {error && (
                    <div style={{ color: '#c40000', fontSize: '13px', padding: '12px', background: '#fdf2f2', border: '1px solid #c40000', borderRadius: '4px', marginBottom: '20px' }}>
                        <strong>⚠ Error</strong><br />{error}
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <label style={labelStyle}>Your name</label>
                            <input type="text" placeholder="First and last name" style={inputStyle} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />

                            <label style={labelStyle}>Mobile number (optional)</label>
                            <input type="tel" style={inputStyle} value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />

                            <label style={labelStyle}>Email</label>
                            <input type="email" style={inputStyle} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />

                            <button className="btn-primary" style={{ width: '100%', padding: '12px', fontSize: '16px', marginTop: '10px' }} onClick={handleNextStep}>
                                Continue to Biometric Setup
                            </button>

                            <div style={{ marginTop: '20px', fontSize: '13px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                                Already have an account? <Link to="/login" style={{ color: '#007185', textDecoration: 'none', fontWeight: '600' }}>Sign-in →</Link>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <p style={{ fontSize: '14px', marginBottom: '20px', color: '#555' }}>Final Step: Secure your account with **FaceID** for <strong>{formData.email}</strong></p>

                            <div style={{
                                position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden',
                                backgroundColor: '#111', border: '4px solid #fff', boxShadow: '0 0 0 1px #ddd',
                                marginBottom: '20px'
                            }}>
                                {!modelsLoaded ? (
                                    <div style={{ padding: '60px 0', textAlign: 'center', color: '#999' }}>Warming up biometric scanner...</div>
                                ) : (
                                    <video ref={videoRef} autoPlay muted style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} />
                                )}
                                <div style={{
                                    position: 'absolute', bottom: '0', left: '0', right: '0',
                                    padding: '10px', background: 'rgba(0,0,0,0.6)', color: 'white',
                                    textAlign: 'center', fontSize: '12px'
                                }}>
                                    {status}
                                </div>
                            </div>

                            <button className="btn-primary" onClick={handleRegister} style={{ width: '100%', padding: '12px', fontSize: '16px' }} disabled={!modelsLoaded}>
                                Capture & Link Account
                            </button>

                            <button className="btn-secondary" onClick={() => setStep(1)} style={{ width: '100%', marginTop: '10px' }}>
                                Back to details
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Signup;
