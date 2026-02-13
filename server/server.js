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
    console.warn('MongoDB Connection Failed (Emails will still work) ⚠️');
    console.error(err.message);
  }
};
connectDB();

// Keep server alive even if DB fails
setInterval(() => { console.log('Keep-alive ping'); }, 1000 * 60 * 60);

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
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Save to MongoDB (Try/Catch to allow email sending even if DB fails)
    try {
      if (mongoose.connection.readyState === 1) {
        await Contact.create({ name, email, message });
      } else {
        console.warn('MongoDB not connected, skipping DB save.');
      }
    } catch (dbErr) {
      console.error('Database Save Failed (Continuing to Email) ⚠️:', dbErr.message);
    }

    // Send email
    await transporter.sendMail({
      from: 'Portfolio <onboarding@resend.dev>',
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: `New Contact from ${name}`,
      text: `
  Name: ${name}
  Email: ${email}

  Message:
  ${message}
        `
    });

    // SUCCESS RESPONSE (JSON ALWAYS)
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully'
    });

  } catch (err) {
    console.error('CONTACT ERROR 👉', err);

    // ERROR RESPONSE (JSON ALWAYS)
    return res.status(500).json({
      success: false,
      message: err.message || 'Server error',
      error: {
        code: err.code,
        name: err.name,
        details: err.response
      }
    });
  }
});

app.get('/api/status', (req, res) => {
  res.json({ status: 'Backend running 🚀' });
});

// =====================
// Production Setup (SPA Routing)
// =====================
// Serve static files from the React app (dist folder)
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// =====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
