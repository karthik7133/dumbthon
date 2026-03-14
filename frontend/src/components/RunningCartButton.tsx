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
        "Wait! Not yet! 😂",
        "Higher discount ahead? (Just kidding) 🏃‍♂️",
        "Are you sure? Choose wisely! 🤔",
        "Hold your horses! 🐎",
        "Catch me if you can! 💨",
        "One more try! 😉"
    ];

    useEffect(() => {
        if (dodgeCount > 0 && dodgeCount < targetDodges.current) {
            setBannerText(funnyMessages[Math.floor(Math.random() * funnyMessages.length)]);
            const timer = setTimeout(() => setBannerText(""), 1200);
            return () => clearTimeout(timer);
        } else if (dodgeCount >= targetDodges.current) {
            setBannerText("Okay, it's yours! 🎁");
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

        if (distance < 100) {
            const angle = Math.atan2(buttonCenterY - e.clientY, buttonCenterX - e.clientX);
            const moveDist = 80 + Math.random() * 100;

            let newX = position.x + Math.cos(angle) * moveDist;
            let newY = position.y + Math.sin(angle) * moveDist;

            const bound = 150;
            newX = Math.max(-bound, Math.min(bound, newX));
            newY = Math.max(-bound, Math.min(bound, newY));

            setPosition({ x: newX, y: newY });
            setDodgeCount(prev => prev + 1);
        }
    };

    return (
        <div style={{ position: 'relative', height: '40px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <AnimatePresence>
                {bannerText && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.5 }}
                        animate={{ opacity: 1, y: -45, scale: 1 }}
                        exit={{ opacity: 0, y: -60, scale: 0.8 }}
                        style={{
                            position: 'absolute',
                            zIndex: 100,
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
                            pointerEvents: 'none'
                        }}
                    >
                        {bannerText}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                ref={buttonRef}
                className="btn-primary"
                style={{
                    position: 'absolute',
                    width: '100%',
                    zIndex: isTrapped ? 1 : 10,
                    borderRadius: '20px',
                    borderColor: '#a88734',
                    background: isTrapped ? 'linear-gradient(to bottom, #f7dfa1, #f0c14b)' : 'linear-gradient(to bottom, #f7dfa1, #e38800)'
                }}
                animate={{
                    x: position.x,
                    y: position.y,
                    scale: isTrapped ? [1, 1.1, 1] : 1
                }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                    scale: { duration: 0.3 }
                }}
                onMouseMove={handleMouseMove}
                onClick={(e) => {
                    if (isTrapped) {
                        onAdd();
                    } else {
                        // If they somehow click it before dodge (unlikely with movement but possible)
                        setDodgeCount(prev => prev + 1);
                    }
                }}
            >
                {isTrapped ? "✅ Added to Cart" : "Add to Cart"}
            </motion.button>
        </div>
    );
};

export default RunningCartButton;
