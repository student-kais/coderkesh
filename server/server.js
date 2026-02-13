const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// MongoDB Connection
// =====================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');
  } catch (err) {
    console.error('MongoDB Connection Error ❌:', err.message);
  }
};
connectDB();

// =====================
// Schema
// =====================
const ContactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', ContactSchema);

// =====================
// Resend SMTP
// =====================
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 465,
  secure: true,
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY
  }
});

// =====================
// API Routes
// =====================

app.post('/api/contact', async (req, res) => {
  console.log('Incoming Contact Request 📩:', req.body);

  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    // Attempt DB Save
    try {
      if (mongoose.connection.readyState === 1) {
        await Contact.create({ name, email, message });
        console.log('Saved to MongoDB ✅');
      }
    } catch (dbErr) {
      console.warn('Database Save Failed (Continuing anyway) ⚠️:', dbErr.message);
    }

    // Attempt Email Send
    console.log('Attempting to send email via Resend...');
    await transporter.sendMail({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL, // Must be kaismanknojiya@gmail.com for Resend free test
      subject: `New Portal Message: ${name}`,
      text: `Agent: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });
    console.log('Email Sent Successfully ✅');

    return res.status(200).json({
      success: true,
      message: 'Transmission Received'
    });

  } catch (err) {
    console.error('CRITICAL CONTACT ERROR ❌:', err);
    return res.status(500).json({
      success: false,
      message: 'Server failed to process transmission'
    });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend operational 🚀' });
});

// =====================
// Production Setup
// =====================
app.use(express.static(path.join(__dirname, '../dist')));

app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  }
});

// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
