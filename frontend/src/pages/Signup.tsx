import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerFace } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

type ScanStatus = 'idle' | 'loading_models' | 'cam_starting' | 'ready' | 'scanning' | 'success' | 'error' | 'no_face';

const Signup: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [step, setStep] = useState<1 | 2>(1);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
    const [error, setError] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    /* ─── Load models on mount ─── */
    useEffect(() => {
        const load = async () => {
            setScanStatus('loading_models');
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/face-models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/face-models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/face-models'),
                ]);
                setModelsLoaded(true);
                setScanStatus('idle');
            } catch {
                setError('NEURAL CORES UNAVAILABLE. PLEASE REFRESH.');
                setScanStatus('error');
            }
        };
        load();
        return () => stopAll();
    }, []);

    /* ─── Live face overlay when on step 2 ─── */
    useEffect(() => {
        if (step === 2 && modelsLoaded) {
            intervalRef.current = setInterval(drawOverlay, 200);
        }
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [step, modelsLoaded]);

    const startCamera = async () => {
        setScanStatus('cam_starting');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => setScanStatus('ready');
            }
        } catch {
            setError('CAMERA ACCESS DENIED. GRANT PERMISSION TO REGISTER YOUR FACE.');
            setScanStatus('error');
        }
    };

    const stopAll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
    };

    const drawOverlay = useCallback(async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas || video.readyState < 2) return;

        const detection = await faceapi.detectSingleFace(
            video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 })
        ).withFaceLandmarks();

        const dims = { width: video.videoWidth || 640, height: video.videoHeight || 480 };
        faceapi.matchDimensions(canvas, dims);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (detection) {
            const resized = faceapi.resizeResults(detection, dims);
            const box = resized.detection.box;
            const pad = 10, blen = 20;
            ctx.strokeStyle = '#FF8C00'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
            ctx.shadowColor = '#FF8C00'; ctx.shadowBlur = 10;
            const x = box.x - pad, y = box.y - pad, w = box.width + pad * 2, h = box.height + pad * 2;
            ctx.beginPath(); ctx.moveTo(x, y + blen); ctx.lineTo(x, y); ctx.lineTo(x + blen, y); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + w - blen, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + blen); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y + h - blen); ctx.lineTo(x, y + h); ctx.lineTo(x + blen, y + h); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x + w - blen, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - blen); ctx.stroke();
        }
    }, []);

    /* ─── Form validation ─── */
    const validateStep1 = () => {
        const errs: Record<string, string> = {};
        if (!formData.name.trim()) errs.name = 'Full name is required';
        if (!formData.email.trim()) errs.email = 'Email address is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email address';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleNextStep = () => {
        if (!validateStep1()) return;
        setError('');
        setStep(2);
        setTimeout(startCamera, 300);
    };

    const handleRegister = async () => {
        if (!videoRef.current || !modelsLoaded) return;
        setScanStatus('scanning');
        setError('');

        try {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.35 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                setScanStatus('no_face');
                setError('NO FACE DETECTED. POSITION YOURSELF IN FRAME AND ENSURE GOOD LIGHTING.');
                return;
            }

            const descriptor = Array.from(detection.descriptor);
            const res = await registerFace(formData.name.trim(), formData.email.trim(), formData.phone.trim(), descriptor);

            login(res.data.user, res.data.token);
            setScanStatus('success');
            stopAll();
            setTimeout(() => navigate('/'), 700);
        } catch (err: any) {
            const msg = err?.response?.data?.msg || err?.response?.data?.error || 'REGISTRATION FAILED. PLEASE TRY AGAIN.';
            setError(msg);
            setScanStatus('error');
        }
    };

    const goBack = () => {
        stopAll();
        setScanStatus('idle');
        setError('');
        setStep(1);
    };

    const statusText: Record<ScanStatus, string> = {
        idle: 'STANDBY',
        loading_models: 'LOADING CORES...',
        cam_starting: 'STARTING CAMERA...',
        ready: 'FACE CAMERA TO ENROLL',
        scanning: 'ENCODING BIOMETRICS...',
        success: 'ENROLLMENT COMPLETE',
        error: 'ERROR',
        no_face: 'NO SUBJECT DETECTED',
    };

    const statusDotClass: Record<ScanStatus, string> = {
        idle: 'status-dot--green',
        loading_models: 'status-dot--orange',
        cam_starting: 'status-dot--orange',
        ready: 'status-dot--green',
        scanning: 'status-dot--orange',
        success: 'status-dot--green',
        error: 'status-dot--red',
        no_face: 'status-dot--red',
    };

    return (
        <div className="auth-container" style={{ minHeight: '100vh' }}>
            {/* Ambient glows */}
            <div style={{ position: 'fixed', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,140,0,0.05) 0%, transparent 70%)', borderRadius: '50%', top: '-100px', right: '-150px', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(79,195,247,0.05) 0%, transparent 70%)', borderRadius: '50%', bottom: '0', left: '-80px', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="glass"
                style={{ width: '100%', maxWidth: '520px', padding: '48px 44px' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <motion.div
                        style={{
                            width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 20px',
                            background: 'linear-gradient(135deg, rgba(255,140,0,0.2) 0%, rgba(255,165,51,0.08) 100%)',
                            border: '1px solid rgba(255,140,0,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 32px rgba(255,140,0,0.15)', fontSize: '26px'
                        }}
                    >
                        🛒
                    </motion.div>
                    <div className="text-label" style={{ marginBottom: '10px' }}>SHOPKART — NEW ACCOUNT</div>
                    <h1 style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                        Create Your <span className="text-gradient">Identity</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
                        {step === 1 ? 'Fill in your details to get started' : 'Enroll your face for instant login'}
                    </p>
                </div>

                {/* Step indicator */}
                <div className="step-indicator" style={{ justifyContent: 'center', marginBottom: '32px' }}>
                    <div className={`step-dot ${step >= 1 ? 'active' : ''}`} />
                    <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: step === 2 ? 'var(--primary)' : 'var(--glass-border)', transition: 'var(--transition)' }} />
                    <div className={`step-dot ${step === 2 ? 'active' : step > 2 ? 'done' : ''}`} />
                </div>

                {/* Global error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            key="err"
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            className="alert-error"
                            style={{ marginBottom: '24px' }}
                        >
                            <span>⚠</span>
                            <span style={{ fontSize: '12px' }}>{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                    {step === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Full Name */}
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={e => { setFormData({ ...formData, name: e.target.value }); setFormErrors({ ...formErrors, name: '' }); }}
                                />
                                {formErrors.name && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>⚠ {formErrors.name}</div>}
                            </div>

                            {/* Email */}
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="form-input"
                                    value={formData.email}
                                    onChange={e => { setFormData({ ...formData, email: e.target.value }); setFormErrors({ ...formErrors, email: '' }); }}
                                />
                                {formErrors.email && <div style={{ color: 'var(--danger)', fontSize: '12px', marginTop: '6px' }}>⚠ {formErrors.email}</div>}
                            </div>

                            {/* Phone (optional) */}
                            <div className="form-group">
                                <label className="form-label">Phone Number <span style={{ color: 'var(--text-muted)', textTransform: 'none', fontSize: '11px', letterSpacing: 0 }}>(optional)</span></label>
                                <input
                                    type="tel"
                                    placeholder="+91 00000 00000"
                                    className="form-input"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <button
                                className="btn-primary"
                                onClick={handleNextStep}
                                style={{ width: '100%', height: '56px', fontSize: '13px', letterSpacing: '2px', marginTop: '8px' }}
                            >
                                Continue → Face Enrollment
                            </button>

                            <div className="divider" style={{ margin: '24px 0 20px' }}>Already have an account?</div>

                            <Link to="/login" style={{ textDecoration: 'none', display: 'block' }}>
                                <button className="btn-secondary" style={{ width: '100%', height: '50px', fontSize: '13px' }}>
                                    Sign In Instead
                                </button>
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Camera */}
                            <div style={{
                                position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden',
                                border: '1px solid rgba(255,140,0,0.2)', background: '#0a0a0d',
                                aspectRatio: '4/3', marginBottom: '24px',
                                boxShadow: '0 0 0 4px rgba(255,140,0,0.04), 0 20px 60px rgba(0,0,0,0.5)',
                            }}>
                                {/* Video always mounted so videoRef is never null when stream arrives */}
                                <video
                                    ref={videoRef}
                                    autoPlay muted playsInline
                                    style={{
                                        width: '100%', height: '100%', objectFit: 'cover',
                                        transform: 'scaleX(-1)', display: 'block',
                                        opacity: (scanStatus === 'loading_models' || scanStatus === 'cam_starting') ? 0 : 1,
                                        transition: 'opacity 0.4s ease',
                                    }}
                                />
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        position: 'absolute', inset: 0, pointerEvents: 'none',
                                        transform: 'scaleX(-1)', width: '100%', height: '100%',
                                    }}
                                />

                                {/* Spinner overlay — shown only while camera is initialising */}
                                {(scanStatus === 'loading_models' || scanStatus === 'cam_starting') && (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', background: 'rgba(10,10,13,0.92)' }}>
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                                            style={{ width: '36px', height: '36px', border: '2px solid rgba(255,255,255,0.06)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}
                                        />
                                        <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', color: 'var(--text-muted)' }}>
                                            {statusText[scanStatus]}
                                        </div>
                                    </div>
                                )}

                                {/* Scan line */}
                                {scanStatus === 'scanning' && (
                                    <motion.div
                                        animate={{ top: ['0%', '100%'] }}
                                        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                        style={{
                                            position: 'absolute', left: 0, right: 0, height: '2px',
                                            background: 'linear-gradient(to right, transparent 0%, var(--primary) 50%, transparent 100%)',
                                            boxShadow: '0 0 20px var(--primary)', zIndex: 10,
                                        }}
                                    />
                                )}

                                {/* Corner brackets HUD */}
                                {['tl', 'tr', 'bl', 'br'].map(corner => (
                                    <div key={corner} style={{
                                        position: 'absolute',
                                        width: '20px', height: '20px',
                                        borderColor: 'rgba(255,140,0,0.5)',
                                        borderStyle: 'solid',
                                        borderWidth: corner.includes('t') ? '2px 0 0' : '0 0 2px',
                                        borderRightWidth: corner.includes('r') ? '2px' : '0',
                                        borderLeftWidth: corner.includes('l') ? '2px' : '0',
                                        top: corner.includes('t') ? '12px' : 'auto',
                                        bottom: corner.includes('b') ? '12px' : 'auto',
                                        left: corner.includes('l') ? '12px' : 'auto',
                                        right: corner.includes('r') ? '12px' : 'auto',
                                    }} />
                                ))}

                                {/* Status bar */}
                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px 16px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <span className={`status-dot ${statusDotClass[scanStatus]}`} />
                                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px', color: 'white' }}>
                                        {statusText[scanStatus]}
                                    </span>
                                </div>
                            </div>

                            <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '20px', lineHeight: 1.5 }}>
                                Look directly at the camera. Ensure your face is centred and well-lit.
                            </p>

                            <button
                                className="btn-primary"
                                onClick={handleRegister}
                                disabled={['scanning', 'loading_models', 'cam_starting', 'success'].includes(scanStatus)}
                                style={{ width: '100%', height: '56px', fontSize: '13px', letterSpacing: '2px' }}
                            >
                                {scanStatus === 'scanning' ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                            style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                                        />
                                        ENCODING...
                                    </span>
                                ) : scanStatus === 'success' ? '✓ ENROLLED!' : '⚡ Capture & Enroll Face'}
                            </button>

                            <button
                                className="btn-secondary"
                                onClick={goBack}
                                style={{ width: '100%', marginTop: '12px', height: '48px', fontSize: '13px' }}
                            >
                                ← Back to Details
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default Signup;
