import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
    const projects = [
        {
            title: "Grocify",
            description: "A full-stack grocery e-commerce platform with cart, wishlist, and secure checkout. Built for premium user experience.",
            tech: ["React", "Express", "Node.js", "CSS"],
            github: "#",
            live: "#",
            // image: "path/to/image" - using placeholder via CSS
        },
        {
            title: "Portfolio Website",
            description: "This modern, responsive portfolio website featuring advanced animations and glassmorphism design.",
            tech: ["React", "Framer Motion", "Vite"],
            github: "#",
            live: "#",
        },
        {
            title: "Weather App",
            description: "Real-time weather dashboard using OpenWeatherMap API with location detection and 7-day forecast.",
            tech: ["React", "API", "Chart.js"],
            github: "#",
            live: "#",
        }
    ];

    return (
        <section id="projects" className="projects">
            <div className="section-header">
                <h2 className="section-title">My <span className="text-gradient">Projects</span></h2>
            </div>

            <div className="projects-grid">
                {projects.map((project, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="project-card glass"
                    >
                        <div className="project-image">
                            <div className="img-placeholder">
                                {project.title} Preview
                            </div>
                        </div>

                        <div className="project-info">
                            <h3>{project.title}</h3>
                            <p>{project.description}</p>

                            <div className="tech-stack">
                                {project.tech.map((tech, i) => (
                                    <span key={i} className="tech-tag">{tech}</span>
                                ))}
                            </div>

                            <div className="project-links">
                                <a href={project.github} className="icon-link"><FaGithub /> Code</a>
                                <a href={project.live} className="icon-link"><FaExternalLinkAlt /> Live Demo</a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
