const express = require('express');
const mongoose = require('mongoose');
const { Resend } = require('resend');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Attempt Email Send via Resend SDK (Uses HTTP, won't be blocked)
    console.log('Attempting to send email via Resend SDK...');
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Portal <onboarding@resend.dev>',
      to: [process.env.OWNER_EMAIL],
      subject: `New Transmission from ${name}`,
      reply_to: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333; background: #f9f9f9; border-radius: 10px;">
          <h2 style="color: #00e5ff;">Message Received</h2>
          <p><strong>Agent Name:</strong> ${name}</p>
          <p><strong>Secure Email:</strong> ${email}</p>
          <hr style="border: 0; border-top: 1px solid #ddd;" />
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
            ${message.replace(/\n/g, '<br/>')}
          </div>
          <p style="font-size: 12px; color: #888; margin-top: 20px;">Received via Portfolio Portal Transmission</p>
        </div>
      `
    });

    if (error) {
      console.error('Resend SDK Error ❌:', error);
      throw new Error(error.message);
    }

    console.log('Email Sent Successfully ✅ ID:', data.id);

    return res.status(200).json({
      success: true,
      message: 'Transmission Received'
    });

  } catch (err) {
    console.error('CRITICAL ERROR ❌:', err.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to process transmission',
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
