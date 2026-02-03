import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaInstagram, FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaJsSquare } from 'react-icons/fa';
import { SiMongodb } from 'react-icons/si';
import './Hero.css';
import profileImg from '../../assets/profile.jpg';

const Hero = () => {
    const [text, setText] = React.useState('');
    const [isDeleting, setIsDeleting] = React.useState(false);
    const [loopNum, setLoopNum] = React.useState(0);
    const [typingSpeed, setTypingSpeed] = React.useState(150);

    const roles = ["Full-Stack Developer", "MERN Stack Developer", "Frontend Developer", "Backend Developer"];

    React.useEffect(() => {
        const handleTyping = () => {
            const i = loopNum % roles.length;
            const fullText = roles[i];

            setText(isDeleting
                ? fullText.substring(0, text.length - 1)
                : fullText.substring(0, text.length + 1)
            );

            setTypingSpeed(isDeleting ? 100 : 150);

            if (!isDeleting && text === fullText) {
                setTimeout(() => setIsDeleting(true), 2000); // Pause at end
            } else if (isDeleting && text === '') {
                setIsDeleting(false);
                setLoopNum(loopNum + 1);
            }
        };

        const timer = setTimeout(handleTyping, typingSpeed);
        return () => clearTimeout(timer);
    }, [text, isDeleting, loopNum, roles]);

    return (
        <section id="home" className="hero">
            <div className="hero-content">
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="greeting"
                >
                    Hello, It's Me
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="name"
                >
                    Kesh Manknojiya
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="title-wrapper"
                >
                    <h2 className="title">And I'm a <span className="text-gradient">{text}</span><span className="cursor">|</span></h2>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="description"
                >
                    I build high-performance, beautiful web applications with modern technologies.
                    Passionate about creating seamless user experiences and robust backends.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="social-icons"
                >
                    <a href="https://github.com" target="_blank" rel="noreferrer" className="social-icon"><FaGithub /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="social-icon"><FaLinkedin /></a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-icon"><FaInstagram /></a>
                    <a href="mailto:kaismanknojiya@gmail.com" className="social-icon"><FaEnvelope /></a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="cta-buttons"
                >
                    <a href="#contact" className="btn btn-primary">Download CV</a>
                    <a href="#about" className="btn btn-outline">About Me</a>
                    {/* Note: User might want 'Contact Me' or 'Projects' here, but 'About Me' is good for flow */}
                </motion.div>
            </div>

            <div className="hero-image-container">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="blob-bg"
                ></motion.div>

                <div className="orbit-container">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        className="hero-img-wrapper"
                    >
                        <img src={profileImg} alt="Kesh Manknojiya" className="hero-img" />
                    </motion.div>

                    {/* Orbiting Skills */}
                    <div className="orbit-skills">
                        <div className="orbit-item" style={{ '--i': 1 }}><FaReact color="#61DAFB" /></div>
                        <div className="orbit-item" style={{ '--i': 2 }}><FaNodeJs color="#339933" /></div>
                        <div className="orbit-item" style={{ '--i': 3 }}><SiMongodb color="#47A248" /></div>
                        <div className="orbit-item" style={{ '--i': 4 }}><FaJsSquare color="#F7DF1E" /></div>
                        <div className="orbit-item" style={{ '--i': 5 }}><FaHtml5 color="#E34F26" /></div>
                        <div className="orbit-item" style={{ '--i': 6 }}><FaCss3Alt color="#1572B6" /></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
