const nodemailer = require('nodemailer');
require('dotenv').config();

// Test email configuration
async function testEmailService() {
  console.log('🔧 Testing Email Service Configuration...');
  console.log('═'.repeat(50));
  
  // Check environment variables
  console.log('📧 EMAIL_PROVIDER:', process.env.EMAIL_PROVIDER || 'NOT SET');
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
  console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');
  console.log('📧 EMAIL_HOST:', process.env.EMAIL_HOST || 'NOT SET');
  console.log('📧 EMAIL_PORT:', process.env.EMAIL_PORT || 'NOT SET');
  console.log('📧 CLIENT_URL:', process.env.CLIENT_URL || 'NOT SET');
  console.log('═'.repeat(50));

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email service cannot work - missing credentials');
    return;
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test connection
    console.log('🔍 Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ Email service connection successful!');
    
    // Send test email
    console.log('📤 Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: 'praveensuresh2024@gmail.com', // Test email
      subject: 'Test Email from Mock Interview Platform',
      html: `
        <h2>🎉 Email Service Test</h2>
        <p>This is a test email from your Mock Interview Platform.</p>
        <p><strong>Status:</strong> ✅ Email service is working correctly!</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    
  } catch (error) {
    console.error('❌ Email service test failed:');
    console.error('Error:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('🔑 Authentication failed - check EMAIL_USER and EMAIL_PASS');
    } else if (error.code === 'ECONNECTION') {
      console.error('🌐 Connection failed - check network and SMTP settings');
    }
  }
}

testEmailService();