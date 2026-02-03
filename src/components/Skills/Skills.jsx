import React from 'react';
import './Skills.css';
import { motion } from 'framer-motion';

const Skills = () => {
    const skillsData = [
        { category: "Frontend", items: ["HTML/CSS", "JavaScript", "React.js", "TailwindCSS", "Framer Motion"] },
        { category: "Backend", items: ["Node.js", "Express", "MongoDB", "REST APIs", "SQL"] },
        { category: "Tools & Others", items: ["Git/GitHub", "VS Code", "Postman", "Vite", "Responsive Design"] }
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
                            {category.items.map((skill, i) => (
                                <div key={i} className="skill-item">
                                    <span className="skill-name">{skill}</span>
                                    <div className="skill-bar-bg">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '85%' }} // Just a static high percentage for visual aesthetics
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="skill-bar-fill"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default Skills;
