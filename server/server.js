const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// MongoDB Connection
// =====================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected ✅'))
  .catch(err => {
    console.error('MongoDB Error ❌', err);
    process.exit(1);
  });

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
// Routes
// =====================
app.get('/', (req, res) => {
  res.json({ status: 'Backend running 🚀' });
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Save to MongoDB
    await Contact.create({ name, email, message });

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
      message: err.message || 'Server error'
    });
  }
});

// =====================
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
