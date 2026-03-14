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
    const lastDodgeTime = useRef(0);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const funnyMessages = [
        "WARP SPEED! 🛸",
        "WHERE DID I GO? 🕵️‍♂️",
        "TOO SLOW! 💨",
        "CATCH THE GLITCH! 👾",
        "HUGE LEAP! 🚀",
        "CHAOS MODE ACTIVE! 🧬"
    ];

    useEffect(() => {
        if (dodgeCount > 0 && dodgeCount < targetDodges.current) {
            setBannerText(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
            const timer = setTimeout(() => setBannerText(""), 800);
            return () => clearTimeout(timer);
        } else if (dodgeCount >= targetDodges.current && !isTrapped) {
            setBannerText("ACCESS GRANTED! 🔓");
            setIsTrapped(true);
            setPosition({ x: 0, y: 0 });
            const timer = setTimeout(() => setBannerText(""), 2000);
            return () => clearTimeout(timer);
        }
    }, [dodgeCount]);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!buttonRef.current || isTrapped) return;

        const now = Date.now();
        if (now - lastDodgeTime.current < 100) return; // Chaos-level cooldown: 100ms

        const rect = buttonRef.current.getBoundingClientRect();
        const buttonCenterX = rect.left + rect.width / 2;
        const buttonCenterY = rect.top + rect.height / 2;

        const distance = Math.sqrt(
            Math.pow(e.clientX - buttonCenterX, 2) +
            Math.pow(e.clientY - buttonCenterY, 2)
        );

        // Increased reaction distance: 150px
        if (distance < 150) {
            lastDodgeTime.current = now;
            const angle = Math.atan2(buttonCenterY - e.clientY, buttonCenterX - e.clientX);

            // MASSIVE movement distance: 300-600px
            const moveDist = 300 + Math.random() * 300;

            let newX = position.x + Math.cos(angle) * moveDist;
            let newY = position.y + Math.sin(angle) * moveDist;

            // Contain within huge bounds to allow screen-wide jumps
            const boundVertical = 400;
            const boundHorizontal = 500;
            newX = Math.max(-boundHorizontal, Math.min(boundHorizontal, newX));
            newY = Math.max(-boundVertical, Math.min(boundVertical, newY));

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
                            background: 'rgba(255, 140, 0, 0.95)',
                            backdropFilter: 'blur(5px)',
                            color: 'white',
                            padding: '6px 14px',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: '800',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
                            pointerEvents: 'none',
                            letterSpacing: '0.5px',
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
                    gap: '8px',
                    cursor: isTrapped ? 'pointer' : 'default'
                }}
                animate={{
                    x: position.x,
                    y: position.y,
                    scale: isTrapped ? [1, 1.05, 1] : 1,
                    borderColor: isTrapped ? '#00ff00' : 'rgba(255,255,255,0.1)',
                    boxShadow: isTrapped ? '0 0 20px rgba(0,255,0,0.2)' : '0 4px 15px rgba(0,0,0,0.3)'
                }}
                transition={{
                    type: 'spring',
                    stiffness: 1000, // Insane stiffness for instant teleport
                    damping: 25,
                    scale: { duration: 0.2 }
                }}
                onMouseMove={handleMouseMove}
                onClick={(e) => {
                    if (isTrapped) {
                        onAdd();
                    } else {
                        // Incremental dodge count if they somehow manage to click it
                        setDodgeCount(prev => prev + 1);
                    }
                }}
            >
                {isTrapped ? (
                    <>
                        <span style={{ fontSize: '18px' }}>🛒</span>
                        ADD TO CART
                    </>
                ) : (
                    "GET THIS ITEM"
                )}
            </motion.button>
        </div>
    );
};

export default RunningCartButton;
