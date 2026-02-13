import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

const terminalLines = [
    { text: "> Initializing System...", delay: 0 },
    { text: "> Loading Core Modules...", delay: 600 },
    { text: "> Verifying User Access...", delay: 1200 },
    { text: "> Access Granted. Welcome.", delay: 1800, className: "success" }
];

const Preloader = () => {
    const [lines, setLines] = useState([]);
    const [progress, setProgress] = useState(0);
    const [showReveal, setShowReveal] = useState(false);

    useEffect(() => {
        // Line Animation
        terminalLines.forEach((line) => {
            setTimeout(() => {
                setLines(prev => [...prev, line]);
            }, line.delay);
        });

        // Progress Bar Animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                // Random increments for "loading" feel
                return Math.min(prev + Math.floor(Math.random() * 10) + 1, 100);
            });
        }, 150); // Faster updates, smaller increments

        // Final Reveal
        const revealTimer = setTimeout(() => {
            setShowReveal(true);
        }, 2200);

        return () => {
            clearInterval(interval);
            clearTimeout(revealTimer);
        };
    }, []);

    return (
        <motion.div
            className="preloader"
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                filter: "blur(20px)",
                scale: 1.1,
                transition: { duration: 1.0, ease: "easeInOut" }
            }}
        >
            {!showReveal && (
                <div className="terminal-container">
                    <AnimatePresence mode="popLayout">
                        {lines.map((line, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className={`terminal-text ${line.className || ''}`}
                            >
                                {line.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <motion.div
                        className="cursor"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    />
                </div>
            )}

            {!showReveal && (
                <div className="loader-bar-container">
                    <motion.div
                        className="loader-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            <div className={`reveal-text ${showReveal ? 'visible' : ''}`}>
                <span style={{ color: 'var(--primary, #00e5ff)' }}>CODER</span>KESH
            </div>
        </motion.div>
    );
};

export default Preloader;
