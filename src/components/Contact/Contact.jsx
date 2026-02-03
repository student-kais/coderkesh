import React, { useState } from 'react';
import './Contact.css';
import { motion } from 'framer-motion';
import { FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const response = await fetch(
        (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        }
      );

      const data = await response.json();

      if (data.success) {
        setStatus('✅ Message sent successfully!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('❌ Failed to send message');
      }

    } catch (err) {
      console.error(err);
      setStatus('❌ Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="section-header">
        <h2 className="section-title">
          Get In <span className="text-gradient">Touch</span>
        </h2>
      </div>

      <div className="contact-content">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="contact-info glass"
        >
          <h3>Let's Talk</h3>
          <p>I'm open to freelance opportunities or discussing your next project.</p>

          <div className="info-item">
            <FaEnvelope className="icon" />
            <span>kaismanknojiya@gmail.com</span>
          </div>
          <div className="info-item">
            <FaPhone className="icon" />
            <span>9023005673</span>
          </div>
          <div className="info-item">
            <FaMapMarkerAlt className="icon" />
            <span>Palanpur, Gujarat</span>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="contact-form glass"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          />

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>

          {status && <p className="form-status">{status}</p>}
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
