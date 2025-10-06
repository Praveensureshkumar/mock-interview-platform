const nodemailer = require('nodemailer');
require('dotenv').config();

class EmailService {
  constructor() {
    this.setupTransporter();
  }

  setupTransporter() {
    const emailProvider = process.env.EMAIL_PROVIDER || 'console'; // 'gmail', 'ethereal', 'console'
    
    switch (emailProvider) {
      case 'gmail':
        // Free Gmail SMTP (100 emails/day)
        this.transporter = nodemailer.createTransporter({
          service: 'gmail',
          auth: {
            user: process.env.GMAIL_USER, // your-email@gmail.com
            pass: process.env.GMAIL_APP_PASSWORD // App password (not regular password)
          }
        });
        break;
        
      case 'ethereal':
        // Free fake SMTP for testing
        this.setupEtherealTransporter();
        break;
        
      default:
        // Console logging (completely free, for development)
        this.transporter = null;
        console.log('📧 Email Service: Using console logging (no actual emails sent)');
    }
  }

  async setupEtherealTransporter() {
    try {
      // Create test account automatically
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('📧 Ethereal Email Test Account Created:');
      console.log(`   Username: ${testAccount.user}`);
      console.log(`   Password: ${testAccount.pass}`);
    } catch (error) {
      console.error('Failed to create Ethereal account:', error);
      this.transporter = null;
    }
  }

  async sendVerificationEmail(email, name, token) {
    const verificationUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@mockinterview.com',
      to: email,
      subject: 'Verify Your Email - Mock Interview Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">Welcome to Mock Interview Platform!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for signing up! Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${verificationUrl}</p>
          <p><strong>This link will expire in 24 hours.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't create an account, please ignore this email.
          </p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions, 'verification', verificationUrl);
  }

  async sendPasswordResetEmail(email, name, token) {
    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: process.env.FROM_EMAIL || 'noreply@mockinterview.com',
      to: email,
      subject: 'Reset Your Password - Mock Interview Platform',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Password Reset Request</h2>
          <p>Hi ${name},</p>
          <p>You requested to reset your password. Click the button below to create a new password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
          <p><strong>This link will expire in 10 minutes for security.</strong></p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      `
    };

    return await this.sendEmail(mailOptions, 'password reset', resetUrl);
  }

  async sendEmail(mailOptions, emailType, actionUrl) {
    if (!this.transporter) {
      // Console mode - completely free, just log the details
      console.log('\n' + '='.repeat(60));
      console.log(`📧 [${emailType.toUpperCase()}] EMAIL (Console Mode - FREE)`);
      console.log('='.repeat(60));
      console.log(`📮 To: ${mailOptions.to}`);
      console.log(`📋 Subject: ${mailOptions.subject}`);
      console.log(`🔗 Action URL: ${actionUrl}`);
      console.log('='.repeat(60));
      console.log('💡 Email would be sent in production mode');
      console.log('💡 User can manually visit the URL above for testing\n');
      
      return { success: true };
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ ${emailType} email sent to ${mailOptions.to}`);
      
      // Log preview URL for Ethereal email
      if (process.env.EMAIL_PROVIDER === 'ethereal') {
        console.log(`📧 Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
      }
      
      return { success: true };
    } catch (error) {
      console.error(`❌ Failed to send ${emailType} email:`, error.message);
      
      // Fallback to console logging
      console.log('\n' + '='.repeat(60));
      console.log(`📧 [${emailType.toUpperCase()}] EMAIL FALLBACK (Console Mode)`);
      console.log('='.repeat(60));
      console.log(`📮 To: ${mailOptions.to}`);
      console.log(`🔗 Action URL: ${actionUrl}`);
      console.log('='.repeat(60));
      console.log('⚠️ Email service failed, showing URL for manual testing\n');
      
      return { success: false, error: error.message };
    }
  }
}

module.exports = new EmailService();