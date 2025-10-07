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
        // Gmail SMTP with App Password
        this.transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST || 'smtp.gmail.com',
          port: process.env.EMAIL_PORT || 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER, // testsprojects2025@gmail.com
            pass: process.env.EMAIL_PASS // Gmail App password
          },
          tls: {
            rejectUnauthorized: false // Fix for self-signed certificate error
          }
        });
        console.log('📧 Email Service: Gmail SMTP configured');
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3b82f6; margin: 0; font-size: 28px;">🎯 Mock Interview Platform</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Ace Your Next Interview</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Welcome to the Platform! 🚀</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Thank you for joining Mock Interview Platform! We're excited to help you prepare for your dream job interviews.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Please verify your email address to unlock all features and start practicing:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);">
                ✅ Verify Email Address
              </a>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Can't click the button?</strong> Copy and paste this link in your browser:
              </p>
              <p style="word-break: break-all; color: #3b82f6; margin: 10px 0 0 0; font-size: 14px;">${verificationUrl}</p>
            </div>
            
            <div style="border-top: 2px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                ⏰ <strong>This link will expire in 24 hours</strong> for security reasons.
              </p>
              <p style="color: #9ca3af; font-size: 14px; margin: 10px 0 0 0;">
                If you didn't create an account, please ignore this email.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2025 Mock Interview Platform | Sent from testsprojects2025@gmail.com
              </p>
            </div>
          </div>
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #dc2626; margin: 0; font-size: 28px;">🔒 Mock Interview Platform</h1>
              <p style="color: #6b7280; margin: 5px 0 0 0;">Secure Password Reset</p>
            </div>
            
            <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request 🔑</h2>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">Hi <strong>${name}</strong>,</p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Mock Interview Platform account.
            </p>
            <p style="color: #374151; font-size: 16px; line-height: 1.6;">
              Click the button below to create a new secure password:
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);">
                🔑 Reset Password
              </a>
            </div>
            
            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #7f1d1d;">
                <strong>⚠️ Security Notice:</strong> This link will expire in <strong>10 minutes</strong> for your protection.
              </p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
              <p style="margin: 0; font-size: 14px; color: #6b7280;">
                <strong>Can't click the button?</strong> Copy and paste this link in your browser:
              </p>
              <p style="word-break: break-all; color: #dc2626; margin: 10px 0 0 0; font-size: 14px;">${resetUrl}</p>
            </div>
            
            <div style="border-top: 2px solid #e5e7eb; margin-top: 40px; padding-top: 20px;">
              <p style="color: #9ca3af; font-size: 14px; margin: 0;">
                🛡️ If you didn't request this password reset, please ignore this email and your password will remain unchanged.
              </p>
              <p style="color: #9ca3af; font-size: 14px; margin: 10px 0 0 0;">
                For security questions, contact us immediately.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2025 Mock Interview Platform | Sent from testsprojects2025@gmail.com
              </p>
            </div>
          </div>
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