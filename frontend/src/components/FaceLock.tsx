import React, { useRef, useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import { faceUnlock, registerFace } from '../services/api';

interface FaceLockProps {
    onUnlock: (user: any) => void;
}

const FaceLock: React.FC<FaceLockProps> = ({ onUnlock }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('Initializing Secure Login...');
    const [name, setName] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

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
                setStatus('Ready for Face Login');
                startVideo();
            } catch (err) {
                console.error("Model load error", err);
                setStatus('Error loading security components.');
            }
        };
        loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: {} })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Camera access denied", err);
                setStatus('Camera access required for login.');
            });
    };

    const handleScan = async () => {
        if (!videoRef.current) return;
        setStatus('Verifying Identity...');
        setError('');

        const detection = await faceapi.detectSingleFace(
            videoRef.current,
            new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceDescriptor();

        if (detection) {
            const descriptor = Array.from(detection.descriptor);
            if (isRegistering) {
                if (!name) {
                    setError('Please enter your name to register.');
                    setStatus('Ready for Face Login');
                    return;
                }
                const res = await registerFace(name, descriptor);
                onUnlock(res.data.user);
            } else {
                try {
                    const res = await faceUnlock(descriptor);
                    onUnlock(res.data.user);
                } catch (err) {
                    setError('Login failed. Face not recognized.');
                    setStatus('Ready for Face Login');
                }
            }
        } else {
            setError('No face detected. Please face the camera directly.');
            setStatus('Ready for Face Login');
        }
    };

    if (loading) return <div className="card" style={{ textAlign: 'center', padding: '40px' }}>{status}</div>;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '24px', fontWeight: 'normal' }}>
                {isRegistering ? 'Create Account' : 'Sign in'}
            </h2>

            <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#000' }}>
                <video ref={videoRef} autoPlay muted style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', bottom: '10px', left: '0', right: '0', textAlign: 'center', color: 'white', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    {status}
                </div>
            </div>

            {error && <div style={{ color: '#c40000', fontSize: '14px', padding: '10px', backgroundColor: '#fdf2f2', border: '1px solid #c40000', borderRadius: '4px' }}>
                <span style={{ fontWeight: 'bold' }}>⚠ There was a problem</span><br />{error}
            </div>}

            {isRegistering && (
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '13px', fontWeight: 'bold' }}>Your name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #888c8c', borderRadius: '3px', boxSizing: 'border-box' }}
                    />
                </div>
            )}

            <button className="btn-primary" onClick={handleScan} style={{ width: '100%', padding: '10px', marginTop: '10px' }}>
                {isRegistering ? 'Register Face Data' : 'Continue with Face Login'}
            </button>

            <div style={{ fontSize: '13px', marginTop: '15px' }}>
                {isRegistering ? 'Already have an account? ' : 'New to Shopkart? '}
                <a href="#" onClick={(e) => { e.preventDefault(); setIsRegistering(!isRegistering); setError(''); }} style={{ color: '#007185', textDecoration: 'none' }}>
                    {isRegistering ? 'Sign in' : 'Create your account'}
                </a>
            </div>
        </div>
    );
};

export default FaceLock;
