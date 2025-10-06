# 🧪 Complete Testing Guide: Email Verification & Forgot Password

## 🚀 **Step 1: Server Setup**

1. **Create .env file** (if not exists):
```bash
cd server
cp .env.example .env
```

2. **Edit .env file**:
```env
MONGO_URI=mongodb://localhost:27017/mockInterviewDB
JWT_SECRET=your-super-secure-jwt-secret-key-here
EMAIL_PROVIDER=console
CLIENT_URL=http://localhost:3000
```

3. **Start server**:
```bash
cd server
npm run dev
# Server should start on port 5000 (or 5001 if 5000 is busy)
```

## 🖥️ **Step 2: Client Setup**

1. **Update API URL** (if server runs on different port):
```bash
cd client
# Update src/utils/api.js if needed
npm start
```

## 🧪 **Step 3: Testing Scenarios**

### **Test 1: User Registration + Email Verification**

1. **Sign Up Process**:
   - Go to: `http://localhost:3000/auth`
   - Click "Sign up"
   - Fill form:
     ```
     Name: Test User
     Email: test@example.com
     Password: 123456
     Confirm Password: 123456
     ```
   - Click "Sign up"

2. **Check Server Console** (where the magic happens):
   ```
   ============================================================
   📧 [VERIFICATION] EMAIL (Console Mode - FREE)
   ============================================================
   📮 To: test@example.com
   📋 Subject: Verify Your Email - Mock Interview Platform
   🔗 Action URL: http://localhost:3000/verify-email?token=abc123...
   ============================================================
   💡 Email would be sent in production mode
   💡 User can manually visit the URL above for testing
   ```

3. **Copy the verification URL** from console and paste in browser

4. **Expected Result**: "Email Verified!" page

### **Test 2: Forgot Password Flow**

1. **Access Forgot Password**:
   - Go to: `http://localhost:3000/auth`
   - Click "Forgot your password?"

2. **Enter Email**:
   - Enter: `test@example.com`
   - Click "Send Reset Link"

3. **Check Server Console**:
   ```
   ============================================================
   📧 [PASSWORD RESET] EMAIL (Console Mode - FREE)
   ============================================================
   📮 To: test@example.com
   🔗 Action URL: http://localhost:3000/reset-password?token=xyz789...
   ============================================================
   ```

4. **Copy reset URL** and paste in browser

5. **Reset Password**:
   - Enter new password: `newpassword123`
   - Confirm password: `newpassword123`
   - Click "Reset Password"

6. **Test Login** with new password

### **Test 3: Resend Verification**

1. **Sign in** with unverified account
2. **Check profile page** - should show verification option
3. **Click "Resend Verification"**
4. **Check console** for new verification URL

## 📊 **Expected Console Output Examples**

### Successful Signup:
```bash
✅ HuggingFaceService initialized
Server running on port 5001

============================================================
📧 [VERIFICATION] EMAIL (Console Mode - FREE)
============================================================
📮 To: johndoe@example.com
📋 Subject: Verify Your Email - Mock Interview Platform
🔗 Action URL: http://localhost:3000/verify-email?token=a1b2c3d4e5f6...
============================================================
💡 Email would be sent in production mode
💡 User can manually visit the URL above for testing
```

### Successful Password Reset:
```bash
============================================================
📧 [PASSWORD RESET] EMAIL (Console Mode - FREE)
============================================================
📮 To: johndoe@example.com
📋 Subject: Reset Your Password - Mock Interview Platform
🔗 Action URL: http://localhost:3000/reset-password?token=x1y2z3a4b5c6...
============================================================
💡 Email would be sent in production mode
💡 User can manually visit the URL above for testing
```

## 🐛 **Troubleshooting**

### Common Issues:

1. **"Token is not valid" error**:
   - Check if JWT_SECRET is set in .env
   - Verify token hasn't expired

2. **"Invalid verification token"**:
   - Tokens expire after 24 hours (verification) or 10 minutes (reset)
   - Generate new token

3. **Server not starting**:
   - Check if port 5000 is busy
   - Use different port: `PORT=5001 npm run dev`

4. **Email URLs not showing in console**:
   - Verify EMAIL_PROVIDER=console in .env
   - Check server console output

## 🎬 **Demo Script for Portfolio**

**For interviews/presentations:**

1. **Show the signup process**: "Here's how users register"
2. **Point to console**: "In development, we log email URLs here"
3. **Copy URL**: "In production, users would get this via email"
4. **Complete verification**: "This simulates clicking the email link"
5. **Demonstrate security**: "Tokens expire for security"

## ✅ **Success Indicators**

- [ ] User can sign up successfully
- [ ] Verification URL appears in console
- [ ] Email verification page works
- [ ] Forgot password sends reset URL
- [ ] Password reset flow works
- [ ] User can login with new password
- [ ] Tokens expire correctly
- [ ] Error handling works properly

## 🚀 **Next Steps**

Once testing works:
1. **Switch to Gmail** for real emails (if needed)
2. **Deploy to production** with proper email service
3. **Add email templates** for branding
4. **Monitor email delivery** rates

This testing approach shows employers you understand the complete email verification workflow without requiring actual email infrastructure!