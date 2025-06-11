import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false,
  },
});

app.post('/api/contact-form', async (req, res) => {
  try {
    const { name, email, budget, message } = req.body;

    console.log('Received contact form submission:', req.body);

    // 1. Send email to you
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ravhenganiwebsolutions@gmail.com',
      subject: 'New Contact Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Budget: ${budget}
        Message: ${message}
      `,
    };

    await transporter.sendMail(adminMailOptions);

    // 2. Send automatic reply to the sender
    const userMailOptions = {
  from: process.env.EMAIL_USER,
  to: email,
  subject: 'Thank You for Getting in Touch!',
  text: `Hi ${name},

Thank you for reaching out to me. I've received your message and will review it shortly. You can expect a response within 1–2 business days.

Here’s a summary of your submission:
------------------------------------------------
Budget: ${budget}
Message: ${message}

If you have any additional details you'd like to share, feel free to reply to this email.

Best regards,  
Thendo Ravhengani  
Web Developer & Designer  
Portfolio: https://thendoravhengani.co.za
  `,

  html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <p>Hi <strong>${name}</strong>,</p>

      <p>Thank you for reaching out to me. I’ve received your message and will get back to you within 1–2 business days.</p>

      <h3 style="margin-top: 20px;">Submission Summary:</h3>
      <ul>
        <li><strong>Budget:</strong> ${budget}</li>
        <li><strong>Message:</strong> ${message}</li>
      </ul>

      <p>If you have any additional details to share, feel free to reply to this email.</p>

      <p style="margin-top: 30px;">
        Best regards,<br/>
        <strong>Thendo Ravhengani</strong><br/>
        Web Developer & Designer<br/>
        <a href="https://thendoravhengani.co.za" target="_blank">thendoravhengani.co.za</a>
      </p>
    </div>
  `,
};


    await transporter.sendMail(userMailOptions);

    res.status(200).json({ message: 'Form submitted and confirmation sent successfully' });
  } catch (error) {
    console.error('Error submitting form or sending email:', error);
    res.status(500).json({ error: 'Failed to submit form or send confirmation' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});