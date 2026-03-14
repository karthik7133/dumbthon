import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { faceUnlock } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [status, setStatus] = useState('Initializing Login System...');
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
                setStatus('Ready for Identity Check');
                startVideo();
            } catch (err) {
                setStatus('Security Modules Unavailable.');
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
            .catch(() => setStatus('Camera access denied.'));
    };

    const handleScan = async () => {
        if (!videoRef.current) return;
        setStatus('Verifying Face Details...');
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
                setError('Face profile match failed. Please try again or create an account.');
                setStatus('Identity Check Failed');
            }
        } else {
            setError('Position your face clearly within the camera view.');
            setStatus('No Face Detected');
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card auth-card"
            >
                <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Sign-in</h1>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1 }}
                            style={{ width: '30px', height: '30px', border: '3px solid #ddd', borderTopColor: 'var(--primary)', borderRadius: '50%', margin: '0 auto 15px' }}
                        />
                        <div style={{ color: '#666' }}>{status}</div>
                    </div>
                ) : (
                    <>
                        <div style={{
                            position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden',
                            backgroundColor: '#111', border: '4px solid #fff', boxShadow: '0 0 0 1px #ddd',
                            marginBottom: '20px'
                        }}>
                            <video ref={videoRef} autoPlay muted style={{ width: '100%', display: 'block', transform: 'scaleX(-1)' }} />
                            <div style={{
                                position: 'absolute', bottom: '0', left: '0', right: '0',
                                padding: '10px', background: 'rgba(0,0,0,0.6)', color: 'white',
                                textAlign: 'center', fontSize: '13px'
                            }}>
                                {status}
                            </div>
                        </div>

                        {error && (
                            <div style={{ color: '#c40000', fontSize: '13px', padding: '12px', background: '#fdf2f2', border: '1px solid #c40000', borderRadius: '4px', marginBottom: '15px' }}>
                                <strong>Important!</strong> {error}
                            </div>
                        )}

                        <button className="btn-primary" onClick={handleScan} style={{ width: '100%', padding: '12px', fontSize: '16px' }}>
                            Verify Identity
                        </button>
                    </>
                )}

                <div style={{ fontSize: '12px', marginTop: '15px', color: '#555', lineHeight: '1.5' }}>
                    By continuing, you agree to Shopkart's Conditions of Use and Privacy Notice. We use encrypted face data for secure authentication.
                </div>

                <div style={{ marginTop: '25px', borderTop: '1px solid #ddd', paddingTop: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '12px', color: '#767676', marginBottom: '10px' }}>New to Shopkart?</div>
                    <Link to="/signup" style={{ textDecoration: 'none' }}>
                        <button className="btn-secondary" style={{ width: '100%', padding: '10px' }}>Create your Shopkart account</button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
