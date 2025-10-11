const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('🔍 EMAIL DIAGNOSIS STARTING...\n');

// Check environment variables
console.log('📋 ENVIRONMENT VARIABLES:');
console.log('EMAIL_PROVIDER:', process.env.EMAIL_PROVIDER);
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET ✅' : 'NOT SET ❌');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST);
console.log('EMAIL_PORT:', process.env.EMAIL_PORT);
console.log('CLIENT_URL:', process.env.CLIENT_URL);
console.log('FROM_EMAIL:', process.env.FROM_EMAIL);
console.log('\n');

// Test Gmail connection
async function testGmailConnection() {
  console.log('🧪 TESTING GMAIL CONNECTION...');
  
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify connection
    const verified = await transporter.verify();
    console.log('✅ Gmail SMTP connection verified:', verified);

    // Send test email
    const testEmail = {
      from: process.env.FROM_EMAIL || process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to self for testing
      subject: '🧪 Test Email - Mock Interview Platform',
      html: `
        <h2>✅ Email Service Working!</h2>
        <p>This test email confirms that your Gmail SMTP is configured correctly.</p>
        <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
        <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
      `
    };

    const info = await transporter.sendMail(testEmail);
    console.log('✅ Test email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📧 Response:', info.response);
    
    return true;
  } catch (error) {
    console.error('❌ Gmail connection failed:', error.message);
    console.error('💡 Check your Gmail App Password and 2FA settings');
    return false;
  }
}

// Test email service verification email
async function testVerificationEmail() {
  console.log('\n🧪 TESTING VERIFICATION EMAIL GENERATION...');
  
  const emailService = require('./services/emailService');
  
  try {
    const result = await emailService.sendVerificationEmail(
      'test@example.com',
      'Test User',
      'test-token-123'
    );
    
    console.log('✅ Verification email test result:', result);
    return true;
  } catch (error) {
    console.error('❌ Verification email test failed:', error.message);
    return false;
  }
}

// Run all tests
async function runDiagnosis() {
  console.log('🚀 Starting comprehensive email diagnosis...\n');
  
  const gmailTest = await testGmailConnection();
  const verificationTest = await testVerificationEmail();
  
  console.log('\n📊 DIAGNOSIS SUMMARY:');
  console.log('Gmail Connection:', gmailTest ? '✅ WORKING' : '❌ FAILED');
  console.log('Verification Email:', verificationTest ? '✅ WORKING' : '❌ FAILED');
  
  if (gmailTest && verificationTest) {
    console.log('\n🎉 EMAIL SERVICE IS FULLY FUNCTIONAL!');
  } else {
    console.log('\n⚠️ EMAIL SERVICE NEEDS ATTENTION');
    console.log('\n🔧 TROUBLESHOOTING STEPS:');
    console.log('1. Check Gmail App Password is correct');
    console.log('2. Ensure 2FA is enabled on Gmail account');
    console.log('3. Verify all environment variables are set');
    console.log('4. Check deployment platform environment variables');
  }
}

runDiagnosis().catch(console.error);