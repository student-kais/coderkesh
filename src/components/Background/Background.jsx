import React, { useEffect, useRef } from 'react';
import './Background.css';

const Background = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        // Configuration
        const particleCount = 60; // Balanced density
        const connectionDistance = 150;
        const mouseDistance = 200;

        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        let mouse = { x: null, y: null };

        const symbols = ['{ }', '< />', '&&', '||', '=>', 'func', 'var', '[]', '#', ';;'];

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slow velocity
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.isSymbol = Math.random() > 0.8; // 20% chance to be a symbol
                this.symbol = symbols[Math.floor(Math.random() * symbols.length)];
                this.color = 'rgba(255, 255, 255, 0.3)'; // Default faint color
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Mouse interaction
                if (mouse.x != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < mouseDistance) {
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (mouseDistance - distance) / mouseDistance;
                        // Gentle attraction
                        const directionX = forceDirectionX * force * 0.6;
                        const directionY = forceDirectionY * force * 0.6;
                        this.vx += directionX * 0.05;
                        this.vy += directionY * 0.05;
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.color;
                if (this.isSymbol) {
                    ctx.font = '12px "Fira Code", monospace';
                    ctx.fillText(this.symbol, this.x, this.y);
                } else {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        let particles = [];
        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw connections first (so lines are behind particles)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    let dx = particles[i].x - particles[j].x;
                    let dy = particles[i].y - particles[j].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        let opacity = 1 - (distance / connectionDistance);

                        // Check distance to mouse for highlighting
                        let mouseDx, mouseDy, mouseDist = 9999;
                        if (mouse.x != null) {
                            mouseDx = mouse.x - particles[i].x;
                            mouseDy = mouse.y - particles[i].y;
                            mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                        }

                        if (mouseDist < mouseDistance) {
                            ctx.strokeStyle = `rgba(0, 229, 255, ${opacity * 0.8})`; // Bright Cyan highlight
                            ctx.lineWidth = 1.5;
                        } else {
                            ctx.strokeStyle = `rgba(150, 150, 150, ${opacity * 0.2})`; // Faint grey default
                            ctx.lineWidth = 0.5;
                        }

                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            init();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        };

        const handleMouseLeave = () => {
            mouse.x = undefined;
            mouse.y = undefined;
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
        };
    }, []);

    return (
        <div className="background-container">
            <canvas ref={canvasRef} className="background-canvas"></canvas>
            {/* Grain/Noise Overlay kept for texture */}
            <div className="noise-overlay"></div>
        </div>
    );
};

export default Background;

