import React from 'react';
import './Skills.css';
import { motion } from 'framer-motion';

const Skills = () => {
    const skillsData = [
        { category: "Frontend", items: ["HTML", "CSS", "TailwindCSS", "JavaScript", "React.js"] },
        { category: "Backend", items: ["Node.js", "Express.js", "MongoDB"] },
        { category: "Tools & Others", items: ["ChatGPT", "Git", "GitHub", "VS Code", "Responsive Design"] }
    ];

    return (
        <section id="skills" className="skills">
            <div className="section-header">
                <h2 className="section-title">Technical <span className="text-gradient">Skills</span></h2>
            </div>

            <div className="skills-container">
                {skillsData.map((category, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                        className="skill-category glass"
                    >
                        <h3>{category.category}</h3>
                        <div className="skill-list">
                            {category.items.map((skill, i) => {
                                // Deterministic "random" percentage between 75 and 80
                                const percentage = 75 + ((skill.length + i) % 6);
                                return (
                                    <div key={i} className="skill-item">
                                        <div className="skill-info">
                                            <span className="skill-name">{skill}</span>
                                        </div>
                                        <div className="skill-bar-bg">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${percentage}%` }}
                                                transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                                                className="skill-bar-fill"
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
