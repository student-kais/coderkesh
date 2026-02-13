import React, { useEffect, useRef } from 'react';
import './Cursor.css';

const Cursor = () => {
    const cursorRef = useRef(null);
    const cursorVisible = useRef(true);

    useEffect(() => {
        // Toggle cursor visibility
        const toggleCursorVisibility = () => {
            if (cursorVisible.current) {
                if (cursorRef.current) cursorRef.current.style.opacity = 1;
            } else {
                if (cursorRef.current) cursorRef.current.style.opacity = 0;
            }
        };

        // Event Listeners
        const mouseMoveEvent = (e) => {
            cursorVisible.current = true;
            toggleCursorVisibility();

            if (cursorRef.current) {
                // Direct movement (no lag)
                cursorRef.current.style.left = e.clientX + 'px';
                cursorRef.current.style.top = e.clientY + 'px';
            }
        };

        const mouseEnterEvent = () => {
            cursorVisible.current = true;
            toggleCursorVisibility();
        };

        const mouseLeaveEvent = () => {
            cursorVisible.current = false;
            toggleCursorVisibility();
        };

        const mouseOverEvent = (e) => {
            if (e.target.closest('a, button, input, textarea, .interactive')) {
                // Add hover class to body or elements for style changes
                document.body.classList.add('hovering');
            }
        };

        const mouseOutEvent = (e) => {
            if (e.target.closest('a, button, input, textarea, .interactive')) {
                document.body.classList.remove('hovering');
            }
        };

        document.addEventListener('mousemove', mouseMoveEvent);
        document.addEventListener('mouseenter', mouseEnterEvent);
        document.addEventListener('mouseleave', mouseLeaveEvent);
        document.addEventListener('mouseover', mouseOverEvent);
        document.addEventListener('mouseout', mouseOutEvent);

        return () => {
            document.removeEventListener('mousemove', mouseMoveEvent);
            document.removeEventListener('mouseenter', mouseEnterEvent);
            document.removeEventListener('mouseleave', mouseLeaveEvent);
            document.removeEventListener('mouseover', mouseOverEvent);
            document.removeEventListener('mouseout', mouseOutEvent);
            // Ensure cleanup
            document.body.style.cursor = 'auto';
            document.body.classList.remove('hovering');
        };
    }, []);

    return (
        <div ref={cursorRef} className="custom-cursor"></div>
    );
};

export default Cursor;
