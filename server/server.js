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
// SMTP Configuration (Updated to 587 for better reliability)
// =====================
const transporter = nodemailer.createTransport({
  host: 'smtp.resend.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: 'resend',
    pass: process.env.RESEND_API_KEY
  },
  connectionTimeout: 10000, // 10 seconds timeout
});

// Verify SMTP connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Failed ❌:', error);
  } else {
    console.log('SMTP Server is ready to take messages ✅');
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

    // Save to DB
    try {
      if (mongoose.connection.readyState === 1) {
        await Contact.create({ name, email, message });
        console.log('Saved to MongoDB ✅');
      }
    } catch (dbErr) {
      console.warn('DB Save Failed:', dbErr.message);
    }

    // Attempt Email Send
    console.log('Attempting to send email...');
    const info = await transporter.sendMail({
      from: 'Portfolio Portal <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `New Message from ${name}`,
      text: `Agent: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #00e5ff;">New Transmission Received</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `
    });

    console.log('Email Sent Successfully ✅ Info ID:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Transmission Received'
    });

  } catch (err) {
    console.error('CRITICAL EMAIL ERROR ❌:', err.stack); // More detailed error stack
    return res.status(500).json({
      success: false,
      message: 'Failed to process email. Check server logs.',
      error: err.message
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
