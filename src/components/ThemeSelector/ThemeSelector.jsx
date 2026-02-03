import React, { useState, useEffect } from 'react';
import { FaPalette, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './ThemeSelector.css';

const themes = [
    { id: 'neon', name: 'Neon', color: '#00e5ff' },
    { id: 'matrix', name: 'Matrix', color: '#00e676' },
    { id: 'sunset', name: 'Sunset', color: '#ff9100' }
];

const ThemeSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTheme, setActiveTheme] = useState('neon');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', activeTheme);
    }, [activeTheme]);

    const toggleOpen = () => setIsOpen(!isOpen);

    const handleThemeChange = (themeId) => {
        setActiveTheme(themeId);
        // setIsOpen(false); // Optional: close on select
    };

    return (
        <div className="theme-selector-container">
            <button
                className={`theme-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={toggleOpen}
                aria-label="Change Theme"
            >
                <FaPalette />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="theme-options"
                    >
                        {themes.map((theme) => (
                            <button
                                key={theme.id}
                                className={`theme-option ${activeTheme === theme.id ? 'active' : ''}`}
                                onClick={() => handleThemeChange(theme.id)}
                            >
                                <span
                                    className="theme-color-preview"
                                    style={{ background: theme.color }}
                                ></span>
                                <span className="theme-name">{theme.name}</span>
                                {activeTheme === theme.id && <FaCheck className="check-icon" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ThemeSelector;
