import React from 'react';
import './About.css';
import { motion } from 'framer-motion';
import aboutImg from '../../assets/about.jpg';

const About = () => {
    return (
        <section id="about" className="about">
            <div className="section-header">
                <h2 className="section-title">About <span className="text-gradient">Me</span></h2>
            </div>

            <div className="about-content">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="about-image-wrapper"
                >
                    <div className="about-image-placeholder">
                        <img src={aboutImg} alt="Kesh Manknojiya" className="about-img" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="about-text"
                >
                    <h3>I'm Kesh Manknojiya, a Passionate Developer.</h3>
                    <p>
                        I am currently pursuing a BSc in IT. My journey in web development began with a curiosity about how things work on the internet,
                        which quickly turned into a passion for building robust and scalable applications.
                    </p>
                    <p>
                        I specialize in the MERN stack (MongoDB, Express, React, Node.js).
                        I love turning complex problems into simple, beautiful, and intuitive interface designs.
                        When I'm not coding, I'm exploring the latest technologies or working on my pet projects like "Grocify".
                    </p>

                    <div className="about-stats">
                        <div className="stat-item">
                            <span className="stat-number">2+</span>
                            <span className="stat-label">Years Experience</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">10+</span>
                            <span className="stat-label">Projects Completed</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
