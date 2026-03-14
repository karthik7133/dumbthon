import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RunningCartButtonProps {
    onAdd: () => void;
}

const RunningCartButton: React.FC<RunningCartButtonProps> = ({ onAdd }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dodgeCount, setDodgeCount] = useState(0);
    const [isTrapped, setIsTrapped] = useState(false);
    const [bannerText, setBannerText] = useState("");

    // Annoy for 2-3 attempts as requested
    const targetDodges = useRef(Math.floor(Math.random() * 2) + 2);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const funnyMessages = [
        "NICE TRY! 😉",
        "TOO SLOW. 💨",
        "MISSING OUT? 😂",
        "NOT FOR YOU. 🔒",
        "KEEP CHASING. 🏃‍♂️",
        "ALMOST THERE. ✨"
    ];

    useEffect(() => {
        if (dodgeCount > 0 && dodgeCount < targetDodges.current) {
            setBannerText(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
            const timer = setTimeout(() => setBannerText(""), 1200);
            return () => clearTimeout(timer);
        } else if (dodgeCount >= targetDodges.current) {
            setBannerText("ACCESS GRANTED! 🔓");
            setIsTrapped(true);
            setPosition({ x: 0, y: 0 });
            const timer = setTimeout(() => setBannerText(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [dodgeCount]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current || isTrapped) return;

        const rect = buttonRef.current.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(e.clientX - buttonCenterX, 2) +
            Math.pow(e.clientY - buttonCenterY, 2)
        );

        if (distance < 90) {
            const angle = Math.atan2(buttonCenterY - e.clientY, buttonCenterX - e.clientX);
            const moveDist = 60 + Math.random() * 80;

            let newX = position.x + Math.cos(angle) * moveDist;
            let newY = position.y + Math.sin(angle) * moveDist;

            // Contain within its parent
            const bound = 120;
            newX = Math.max(-bound, Math.min(bound, newX));
            newY = Math.max(-bound, Math.min(bound, newY));

            setPosition({ x: newX, y: newY });
            setDodgeCount(prev => prev + 1);
        }
    };

    return (
        <div style={{ position: 'relative', height: '50px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <AnimatePresence>
                {bannerText && (
                    <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.5 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            zIndex: 100,
                            background: 'rgba(255, 140, 0, 0.9)',
                            backdropFilter: 'blur(5px)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: '800',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
                            pointerEvents: 'none',
                            letterSpacing: '1px',
                            border: '1px solid rgba(255,255,255,0.2)'
                        }}
                    >
                        {bannerText}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                ref={buttonRef}
                className={isTrapped ? "btn-secondary" : "btn-primary"}
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    zIndex: isTrapped ? 1 : 10,
                    textTransform: 'uppercase',
                    fontSize: '13px',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                }}
                animate={{
                    x: position.x,
                    y: position.y,
                    scale: isTrapped ? [1, 1.05, 1] : 1,
                    borderColor: isTrapped ? '#00ff00' : 'rgba(255,255,255,0.1)'
                }}
                transition={{
                    type: 'spring',
                    stiffness: 600,
                    damping: 35,
                    scale: { duration: 0.2 }
                }}
                onMouseMove={handleMouseMove}
                onClick={(e) => {
                    if (isTrapped) {
                        onAdd();
                    } else {
                        setDodgeCount(prev => prev + 1);
                    }
                }}
            >
                {isTrapped ? (
                    <>
                        <span style={{ fontSize: '18px' }}>✨</span>
                        ACQUIRE NOW
                    </>
                ) : (
                    "ADD TO SELECTION"
                )}
            </motion.button>
        </div>
    );
};

export default RunningCartButton;
