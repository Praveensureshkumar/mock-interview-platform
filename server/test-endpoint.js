// Add this to your server/routes/auth.js for testing emails in production

// TEST EMAIL ENDPOINT (Remove after testing)
router.get('/test-email', async (req, res) => {
  try {
    console.log('🧪 Testing email service...');
    
    // Check environment variables
    const envCheck = {
      EMAIL_PROVIDER: process.env.EMAIL_PROVIDER,
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
      CLIENT_URL: process.env.CLIENT_URL
    };
    
    console.log('📋 Environment variables:', envCheck);
    
    // Send test verification email
    const emailResult = await emailService.sendVerificationEmail(
      'test@example.com', 
      'Test User', 
      'test-token-123'
    );
    
    res.json({
      success: true,
      message: 'Email service test completed',
      environment: envCheck,
      emailResult: emailResult
    });
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      environment: {
        EMAIL_PROVIDER: process.env.EMAIL_PROVIDER || 'NOT SET',
        EMAIL_USER: process.env.EMAIL_USER || 'NOT SET',
        EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
        CLIENT_URL: process.env.CLIENT_URL || 'NOT SET'
      }
    });
  }
});