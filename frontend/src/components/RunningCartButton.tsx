import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RunningCartButtonProps {
    onAdd: () => void;
}

const FLEE_RADIUS = 150;  // px — how close cursor must get to trigger
const FLEE_DIST = 280;  // px — fixed jump distance
const MAX_DODGES = 3;    // how many times it flees before letting you click
const FLEE_HOLD_MS = 380;  // ms — how long it stays away before snapping back
const COOLDOWN_MS = 900;  // ms — min time between dodges (prevents chain-triggers)

const TAUNT_MSGS = ['TRY AGAIN! 😈', 'TOO SLOW! 💨', 'NOPE! 🚀'];
const FINAL_MSG = 'FINE, TAKE IT! 😤';

const RunningCartButton: React.FC<RunningCartButtonProps> = ({ onAdd }) => {
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [dodges, setDodges] = useState(0);
    const [trapped, setTrapped] = useState(false);
    const [taunt, setTaunt] = useState('');
    const [isDodging, setIsDodging] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);
    const trappedRef = useRef(false);
    const dodgesRef = useRef(0);
    const isDodgingRef = useRef(false);
    const lastFlee = useRef(0);

    // Keep refs synced
    trappedRef.current = trapped;
    dodgesRef.current = dodges;
    isDodgingRef.current = isDodging;

    const triggerFlee = useCallback(() => {
        if (trappedRef.current || isDodgingRef.current) return;
        const now = Date.now();
        if (now - lastFlee.current < COOLDOWN_MS) return;
        lastFlee.current = now;

        // Pick a random direction and jump a fixed distance
        const angle = Math.random() * Math.PI * 2;
        const jumpX = Math.cos(angle) * FLEE_DIST;
        const jumpY = Math.sin(angle) * FLEE_DIST;

        const newDodges = dodgesRef.current + 1;

        setIsDodging(true);
        setOffset({ x: jumpX, y: jumpY });
        setDodges(newDodges);
        setTaunt(newDodges >= MAX_DODGES ? FINAL_MSG : TAUNT_MSGS[newDodges - 1] ?? TAUNT_MSGS[0]);

        // Snap back after hold time
        setTimeout(() => {
            setOffset({ x: 0, y: 0 });

            // Short delay then allow next flee / mark as trapped
            setTimeout(() => {
                setIsDodging(false);
                if (newDodges >= MAX_DODGES) {
                    setTrapped(true);
                }
            }, 300);
        }, FLEE_HOLD_MS);
    }, []);

    // Global mousemove — check proximity to button at all times
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (trappedRef.current || isDodgingRef.current) return;
            const btn = buttonRef.current;
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            if (Math.hypot(e.clientX - cx, e.clientY - cy) < FLEE_RADIUS) {
                triggerFlee();
            }
        };
        window.addEventListener('mousemove', handler, { passive: true });
        return () => window.removeEventListener('mousemove', handler);
    }, [triggerFlee]);

    // Clear taunt after a moment
    useEffect(() => {
        if (!taunt) return;
        const t = setTimeout(() => setTaunt(''), 900);
        return () => clearTimeout(t);
    }, [taunt]);

    const dodgesLeft = MAX_DODGES - dodges;

    return (
        <div style={{ position: 'relative', height: '52px', width: '100%', overflow: 'visible' }}>

            {/* Taunt bubble */}
            <AnimatePresence>
                {taunt && (
                    <motion.div
                        key={taunt + dodges}
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -48, scale: 1 }}
                        exit={{ opacity: 0, y: -64, scale: 0.7 }}
                        transition={{ duration: 0.2 }}
                        style={{
                            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                            zIndex: 9999, pointerEvents: 'none', whiteSpace: 'nowrap',
                            background: 'linear-gradient(135deg, #FF8C00, #FFD700)',
                            color: '#000', padding: '5px 14px', borderRadius: '100px',
                            fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px',
                            boxShadow: '0 4px 20px rgba(255,140,0,0.5)',
                        }}
                    >
                        {taunt}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                ref={buttonRef}
                className={trapped ? 'btn-primary' : 'btn-secondary'}
                style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%',
                    fontSize: '13px', letterSpacing: '1.5px', fontWeight: '700',
                    cursor: trapped ? 'pointer' : 'default',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    border: trapped ? undefined : '1px solid rgba(255,140,0,0.4)',
                    color: trapped ? undefined : 'rgba(255,140,0,1)',
                }}
                animate={{
                    x: offset.x,
                    y: offset.y,
                    scale: isDodging ? 0.88 : 1,
                    opacity: isDodging ? 0.7 : 1,
                    boxShadow: trapped
                        ? '0 0 28px rgba(255,140,0,0.5)'
                        : '0 0 12px rgba(255,140,0,0.15)',
                }}
                transition={isDodging && offset.x !== 0
                    ? { type: 'tween', duration: 0.12, ease: 'easeOut' }  // snap away fast
                    : { type: 'spring', stiffness: 500, damping: 22 }     // spring back
                }
                onClick={() => { if (trapped) onAdd(); }}
            >
                {trapped ? (
                    <><span style={{ fontSize: '16px' }}>🛒</span> ADD TO CART</>
                ) : (
                    <><span style={{ fontSize: '14px' }}>⚡</span>
                        {dodgesLeft > 0
                            ? `CATCH ME (${dodgesLeft} left)`
                            : 'GETTING TIRED...'
                        }
                    </>
                )}
            </motion.button>
        </div>
    );
};

export default RunningCartButton;
