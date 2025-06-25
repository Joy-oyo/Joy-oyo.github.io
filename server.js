const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

// Store verification codes (in production, use a database)
const verificationCodes = new Map();

// Create transporter for sending emails
const transporter = nodemailer.createTransporter({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use app password for Gmail
    }
});

// Email template
const createEmailTemplate = (code) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #002FA7; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .code { font-size: 24px; font-weight: bold; color: #002FA7; text-align: center; padding: 20px; background: white; border-radius: 10px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Joy Chen Portfolio</h1>
        </div>
        <div class="content">
            <h2>Email Verification</h2>
            <p>Thank you for subscribing to my portfolio updates!</p>
            <p>Please use the following verification code to complete your subscription:</p>
            <div class="code">${code}</div>
            <p>This code will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>Best regards,<br>Joy Chen</p>
        </div>
    </div>
</body>
</html>
`;

// Routes
app.post('/api/send-verification', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Generate verification code
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store code with timestamp (expires in 10 minutes)
        verificationCodes.set(email, {
            code,
            timestamp: Date.now(),
            attempts: 0
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification - Joy Chen Portfolio',
            html: createEmailTemplate(code)
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
        console.log(`Verification code sent to ${email}: ${code}`);
        
        res.json({ 
            success: true, 
            message: 'Verification code sent successfully' 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            error: 'Failed to send verification code' 
        });
    }
});

app.post('/api/verify-code', async (req, res) => {
    try {
        const { email, code } = req.body;
        
        if (!email || !code) {
            return res.status(400).json({ error: 'Email and code are required' });
        }

        const storedData = verificationCodes.get(email);
        
        if (!storedData) {
            return res.status(400).json({ error: 'No verification code found for this email' });
        }

        // Check if code has expired (10 minutes)
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        
        if (now - storedData.timestamp > tenMinutes) {
            verificationCodes.delete(email);
            return res.status(400).json({ error: 'Verification code has expired' });
        }

        // Check attempts (max 5 attempts)
        if (storedData.attempts >= 5) {
            verificationCodes.delete(email);
            return res.status(400).json({ error: 'Too many attempts. Please request a new code.' });
        }

        // Increment attempts
        storedData.attempts++;

        // Verify code
        if (storedData.code === code) {
            // Code is correct - remove from storage
            verificationCodes.delete(email);
            
            // Here you would typically save the verified email to a database
            console.log(`Email verified successfully: ${email}`);
            
            res.json({ 
                success: true, 
                message: 'Email verified successfully!' 
            });
        } else {
            res.status(400).json({ error: 'Invalid verification code' });
        }

    } catch (error) {
        console.error('Error verifying code:', error);
        res.status(500).json({ error: 'Failed to verify code' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Visit http://localhost:${PORT} to view your portfolio`);
}); 