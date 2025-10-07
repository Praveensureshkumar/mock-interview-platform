# Email Setup Guide for testsprojects2025@gmail.com

## Step 1: Create Gmail Account
1. Go to [gmail.com](https://gmail.com)
2. Create account with email: `testsprojects2025@gmail.com`
3. Choose a secure password

## Step 2: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com)
2. Click "Security" in the left sidebar
3. Under "How you sign in to Google", click "2-Step Verification"
4. Follow the setup process

## Step 3: Generate App Password
1. In Google Account Settings → Security
2. Under "How you sign in to Google", click "App passwords"
3. Select app: "Mail"
4. Select device: "Other (custom name)" → Type: "Mock Interview Platform"
5. Click "Generate"
6. **Copy the 16-character password** (like: `abcd efgh ijkl mnop`)

## Step 4: Update Environment Variables
1. Open `server/.env` file
2. Replace `your_gmail_app_password_here` with the app password from Step 3
3. Set `EMAIL_PROVIDER=gmail` to enable email sending

```env
# In server/.env file
EMAIL_PROVIDER=gmail
EMAIL_USER=testsprojects2025@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

## Step 5: Test Email Functionality
1. Restart your server: `npm start`
2. Register a new user account
3. Check the console logs for email sending confirmation
4. Check the Gmail account for sent emails

## Benefits of This Setup
✅ **Reusable** - Use for multiple portfolio projects  
✅ **Professional** - Clean sender address  
✅ **Free** - Gmail provides 500 emails/day  
✅ **Reliable** - Gmail's SMTP is very stable  
✅ **Portfolio Ready** - Shows real email integration  

## For Production
For a real production app, consider:
- SendGrid (100 emails/day free)
- Mailgun (5,000 emails/month free)
- AWS SES (very cheap)

## Troubleshooting
- **"Invalid credentials"**: Double-check app password (not regular password)
- **"Less secure apps"**: Use App Password instead
- **No emails sent**: Check `EMAIL_PROVIDER=gmail` in .env file