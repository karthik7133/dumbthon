import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';
import { useNavigate, Link } from 'react-router-dom';
import { faceUnlock } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

type ScanStatus = 'loading' | 'ready' | 'scanning' | 'success' | 'error' | 'no_face' | 'cam_error';

const STATUS_CONFIG: Record<ScanStatus, { label: string; dotClass: string; color: string }> = {
    loading: { label: 'INITIALIZING CORE...', dotClass: 'status-dot--orange', color: '#FF8C00' },
    ready: { label: 'READY FOR SCAN', dotClass: 'status-dot--green', color: '#00E676' },
    scanning: { label: 'SCANNING...', dotClass: 'status-dot--orange', color: '#FF8C00' },
    success: { label: 'IDENTITY CONFIRMED', dotClass: 'status-dot--green', color: '#00E676' },
    error: { label: 'MATCH FAILED', dotClass: 'status-dot--red', color: '#FF5252' },
    no_face: { label: 'NO SUBJECT DETECTED', dotClass: 'status-dot--red', color: '#FF5252' },
    cam_error: { label: 'CAMERA ERROR', dotClass: 'status-dot--red', color: '#FF5252' },
};

const Login: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const [status, setStatus] = useState<ScanStatus>('loading');
    const [error, setError] = useState('');
    const [modelsLoaded, setModelsLoaded] = useState(false);

    const navigate = useNavigate();
    const { login } = useAuth();

    /* ─── Load face-api models ─── */
    useEffect(() => {
        const load = async () => {
            try {
                await Promise.all([
                    faceapi.nets.tinyFaceDetector.loadFromUri('/face-models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/face-models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/face-models'),
                ]);
                setModelsLoaded(true);
                startCamera();
            } catch {
                setStatus('error');
                setError('NEURAL CORES FAILED TO LOAD. REFRESH AND TRY AGAIN.');
            }
        };
        load();
        return () => stopAll();
    }, []);

    /* ─── Live auto-detect overlay ─── */
    useEffect(() => {
        if (!modelsLoaded) return;
        intervalRef.current = setInterval(drawFaceOverlay, 200);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [modelsLoaded]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => setStatus('ready');
            }
        } catch {
            setStatus('cam_error');
            setError('CAMERA ACCESS DENIED. GRANT PERMISSION TO PROCEED.');
        }
    };

    const stopAll = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
    };

    const drawFaceOverlay = useCallback(async () => {
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
            // Draw corner brackets instead of a box for a premium HUD feel
            const box = resized.detection.box;
            const pad = 10;
            const blen = 20;
            ctx.strokeStyle = '#FF8C00';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.shadowColor = '#FF8C00';
            ctx.shadowBlur = 10;

            const x = box.x - pad, y = box.y - pad;
            const w = box.width + pad * 2, h = box.height + pad * 2;
            // Top-left
            ctx.beginPath(); ctx.moveTo(x, y + blen); ctx.lineTo(x, y); ctx.lineTo(x + blen, y); ctx.stroke();
            // Top-right
            ctx.beginPath(); ctx.moveTo(x + w - blen, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + blen); ctx.stroke();
            // Bottom-left
            ctx.beginPath(); ctx.moveTo(x, y + h - blen); ctx.lineTo(x, y + h); ctx.lineTo(x + blen, y + h); ctx.stroke();
            // Bottom-right
            ctx.beginPath(); ctx.moveTo(x + w - blen, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - blen); ctx.stroke();
        }
    }, []);

    const handleScan = async () => {
        if (!videoRef.current || !modelsLoaded) return;
        setStatus('scanning');
        setError('');

        try {
            const detection = await faceapi
                .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.35 }))
                .withFaceLandmarks()
                .withFaceDescriptor();

            if (!detection) {
                setStatus('no_face');
                setError('NO FACE DETECTED. POSITION YOURSELF IN FRAME AND ENSURE GOOD LIGHTING.');
                return;
            }

            const descriptor = Array.from(detection.descriptor);
            const res = await faceUnlock(descriptor);
            login(res.data.user, res.data.token);
            setStatus('success');
            stopAll();
            setTimeout(() => navigate('/'), 600);
        } catch (err: any) {
            const msg = err?.response?.data?.msg || 'IDENTITY NOT RECOGNIZED IN THE SYSTEM.';
            setError(msg);
            setStatus('error');
        }
    };

    const cfg = STATUS_CONFIG[status];

    return (
        <div className="auth-container" style={{ minHeight: '100vh' }}>
            {/* Ambient glows */}
            <div style={{ position: 'fixed', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(255,140,0,0.06) 0%, transparent 70%)', borderRadius: '50%', top: '-100px', left: '-150px', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(79,195,247,0.04) 0%, transparent 70%)', borderRadius: '50%', bottom: '-50px', right: '-100px', pointerEvents: 'none' }} />

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="glass"
                style={{ width: '100%', maxWidth: '500px', padding: '48px 44px' }}
            >
                {/* Logo / Header */}
                <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        style={{
                            width: '64px', height: '64px', borderRadius: '18px', margin: '0 auto 20px',
                            background: 'linear-gradient(135deg, rgba(255,140,0,0.2) 0%, rgba(255,165,51,0.08) 100%)',
                            border: '1px solid rgba(255,140,0,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 32px rgba(255,140,0,0.15)',
                            fontSize: '26px'
                        }}
                    >
                        🛒
                    </motion.div>
                    <div className="text-label" style={{ marginBottom: '10px' }}>SHOPKART — SECURE AUTH</div>
                    <h1 style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-display)', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                        Welcome <span className="text-gradient">Back</span>
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px', fontWeight: '400' }}>
                        Scan your face to authenticate instantly
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {status === 'loading' ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ textAlign: 'center', padding: '60px 0' }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                                style={{
                                    width: '48px', height: '48px', margin: '0 auto 20px',
                                    border: '2px solid rgba(255,255,255,0.06)',
                                    borderTopColor: 'var(--primary)', borderRadius: '50%',
                                    boxShadow: '0 0 20px rgba(255,140,0,0.2)'
                                }}
                            />
                            <div style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: '700', letterSpacing: '2px' }}>
                                LOADING NEURAL CORES...
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="camera" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            {/* Camera Feed */}
                            <div style={{
                                position: 'relative', width: '100%', borderRadius: '16px', overflow: 'hidden',
                                border: '1px solid rgba(255,140,0,0.2)', background: '#0a0a0d',
                                aspectRatio: '4/3', marginBottom: '24px',
                                boxShadow: '0 0 0 4px rgba(255,140,0,0.04), 0 20px 60px rgba(0,0,0,0.5)',
                            }}>
                                <video
                                    ref={videoRef}
                                    autoPlay muted playsInline
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)', display: 'block' }}
                                />

                                {/* Face detection canvas overlay */}
                                <canvas
                                    ref={canvasRef}
                                    style={{
                                        position: 'absolute', inset: 0, pointerEvents: 'none',
                                        transform: 'scaleX(-1)', width: '100%', height: '100%'
                                    }}
                                />

                                {/* Scan line animation */}
                                {status === 'scanning' && (
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

                                {/* HUD overlay — corner brackets */}
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
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    padding: '10px 16px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <span className={`status-dot ${cfg.dotClass}`} />
                                    <span style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '1.5px', color: cfg.color }}>
                                        {cfg.label}
                                    </span>
                                </div>
                            </div>

                            {/* Error */}
                            <AnimatePresence>
                                {error && (
                                    <motion.div
                                        key="err"
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        className="alert-error"
                                        style={{ marginBottom: '20px' }}
                                    >
                                        <span>⚠</span>
                                        <span style={{ fontSize: '12px', letterSpacing: '0.3px' }}>{error}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Scan Button */}
                            <button
                                className="btn-primary"
                                onClick={handleScan}
                                disabled={status === 'scanning' || status === 'success' || status === 'cam_error'}
                                style={{ width: '100%', height: '56px', fontSize: '13px', letterSpacing: '2px' }}
                            >
                                {status === 'scanning' ? (
                                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                                        <motion.span
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                                            style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                                        />
                                        SCANNING...
                                    </span>
                                ) : status === 'success' ? '✓ AUTHENTICATED' : '⚡ RUN BIOMETRIC SCAN'}
                            </button>

                            {/* Tip */}
                            <p style={{ fontSize: '12px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '14px', lineHeight: 1.5 }}>
                                Ensure your face is fully visible & well-lit for best results
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Divider */}
                <div className="divider" style={{ margin: '28px 0 24px' }}>OR</div>

                {/* Signup link */}
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '14px' }}>
                        First time here?
                    </p>
                    <Link to="/signup" style={{ textDecoration: 'none', display: 'block' }}>
                        <button className="btn-secondary" style={{ width: '100%', height: '50px', fontSize: '13px', letterSpacing: '1px' }}>
                            Create New Account
                        </button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
