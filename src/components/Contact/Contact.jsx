import React, { useState } from 'react';
import './Contact.css';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhone, FaPaperPlane, FaCheck, FaGithub, FaLinkedin, FaTwitter, FaTimes, FaRocket } from 'react-icons/fa';

// --- SUB-COMPONENTS (Defined OUTSIDE to fix focus loss bug) ---

const InitialOrb = ({ setView }) => (
  <motion.div
    layoutId="contact-wrapper"
    className="contact-orb-wrapper"
    onClick={() => setView('form')}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <div className="orb-pulse"></div>
    <div className="orb-core">
      <FaRocket className="orb-icon" />
      <span>Let's Connect</span>
    </div>
    <div className="orb-text-hint">Click to Open Portal</div>
  </motion.div>
);

const ContactForm = ({ setView, formData, handleChange, handleSubmit, status }) => (
  <motion.div
    layoutId="contact-wrapper"
    className="contact-card-expanded glass"
  >
    <button className="close-btn" onClick={() => setView('initial')}>
      <FaTimes />
    </button>

    <div className="expanded-content">
      {/* Left: Info */}
      <div className="expanded-left">
        <h3>Contact Coordinates</h3>
        <p className="subtitle">Choose your frequency.</p>

        <div className="info-list">
          <a href="mailto:kaismanknojiya@gmail.com" className="info-row">
            <div className="icon-circle"><FaEnvelope /></div>
            <span>kaismanknojiya@gmail.com</span>
          </a>
          <div className="info-row">
            <div className="icon-circle"><FaPhone /></div>
            <span>+91 9023005673</span>
          </div>
          <div className="info-row">
            <div className="icon-circle"><FaMapMarkerAlt /></div>
            <span>Gujarat, India</span>
          </div>
        </div>

        <div className="social-orbit">
          <a href="#"><FaGithub /></a>
          <a href="#"><FaLinkedin /></a>
          <a href="#"><FaTwitter /></a>
        </div>
      </div>

      {/* Right: Form */}
      <form className="expanded-right" onSubmit={handleSubmit}>
        <h3>Transmit Data</h3>

        <div className="input-field">
          <input
            type="text"
            name="name"
            required
            placeholder=" "
            value={formData.name}
            onChange={handleChange}
          />
          <label>Agent Name</label>
          <div className="highlight-bar"></div>
        </div>

        <div className="input-field">
          <input
            type="email"
            name="email"
            required
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
          />
          <label>Secure Email</label>
          <div className="highlight-bar"></div>
        </div>

        <div className="input-field">
          <textarea
            name="message"
            rows="3"
            required
            placeholder=" "
            value={formData.message}
            onChange={handleChange}
          />
          <label>Message Content</label>
          <div className="highlight-bar"></div>
        </div>

        <button
          type="submit"
          className={`transmit-btn ${status}`}
          disabled={status === 'sending' || status === 'success'}
        >
          {status === 'sending' ? (
            <div className="loader-dots">
              <span>.</span><span>.</span><span>.</span>
            </div>
          ) : status === 'success' ? (
            <>Sent <FaCheck /></>
          ) : (
            <>Initialize <FaPaperPlane /></>
          )}
        </button>
      </form>
    </div>
  </motion.div>
);

const SuccessView = ({ setView }) => (
  <motion.div
    layoutId="contact-wrapper"
    className="success-orb-wrapper"
    onClick={() => setView('initial')}
  >
    <motion.div
      className="success-core"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <FaCheck />
    </motion.div>
    <h3>Transmission Received</h3>
    <p>Click to return</p>
  </motion.div>
);

// --- MAIN COMPONENT ---

const Contact = () => {
  const [view, setView] = useState('initial'); // 'initial' | 'form' | 'success'
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      // Smart URL detection
      const API_BASE = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : 'https://coderkesh.onrender.com';

      const response = await fetch(
        `${API_BASE}/api/contact`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => {
          setView('success');
          setStatus('');
        }, 1500);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), 4000);
      }

    } catch (err) {
      console.error('Frontend Error:', err);
      setStatus('error');
      setTimeout(() => setStatus(''), 4000);
    }
  };

  return (
    <section id="contact" className="contact">
      {/* Ambient Background */}
      <div className="ambient-light"></div>

      <div className="section-header">
        <h2 className="section-title">
          Get In <span className="text-gradient">Touch</span>
        </h2>
        <p className="section-subtitle">Let's build something great together.</p>
      </div>

      <div className="stage-center">
        <AnimatePresence mode="wait">
          {view === 'initial' && <InitialOrb key="initial" setView={setView} />}
          {view === 'form' && (
            <ContactForm
              key="form"
              setView={setView}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              status={status}
            />
          )}
          {view === 'success' && <SuccessView key="success" setView={setView} />}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Contact;
