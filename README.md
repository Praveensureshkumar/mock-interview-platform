# 🎤 Mock Interview Platform

A **professional-grade MERN stack application** for conducting AI-powered mock interviews with comprehensive feedback, email verification, and enterprise-level authentication features.

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue)](https://your-demo-link.com)
[![GitHub Stars](https://img.shields.io/github/stars/Praveensureshkumar/mock-interview-platform)](https://github.com/Praveensureshkumar/mock-interview-platform)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## ✨ Key Features

### 🎯 **Core Interview Platform**
- **AI-Powered Mock Interviews** with real-time question generation
- **Voice Recognition & Analysis** for interactive communication
- **Smart Question Bank** with 1000+ categorized interview questions
- **Real-time Performance Feedback** and detailed analytics
- **Multi-Category Support** (Technical, HR, Behavioral, etc.)

### 🔐 **Enterprise Authentication**
- **Email Verification System** with professional HTML templates
- **Forgot Password & Reset** functionality with secure tokens
- **JWT-based Authentication** with refresh token support
- **Account Security** with password strength validation

### 🎨 **Modern User Experience**
- **Dark/Light Theme Toggle** for personalized experience
- **Responsive Design** optimized for all devices
- **Professional UI/UX** with Tailwind CSS
- **Real-time Notifications** and status updates

### 🤖 **AI Integration**
- **HuggingFace AI Models** for intelligent question analysis
- **Automated Scoring System** based on response quality
- **Smart Recommendations** for interview improvement
- **Natural Language Processing** for answer evaluation

## 🛠️ Tech Stack

### **Frontend**
- ![React](https://img.shields.io/badge/React-19-blue?logo=react) - Modern JavaScript library with hooks
- ![Tailwind](https://img.shields.io/badge/Tailwind-CSS-blue?logo=tailwindcss) - Utility-first CSS framework
- ![Router](https://img.shields.io/badge/React-Router-red?logo=react-router) - Client-side routing
- **Voice Recognition API** - Browser-native speech recognition
- **Context API** - State management for theme and authentication

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js) - JavaScript runtime environment
- ![Express](https://img.shields.io/badge/Express.js-4.x-black?logo=express) - Web application framework
- ![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green?logo=mongodb) - NoSQL database with Mongoose ODM
- ![JWT](https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens) - Secure authentication tokens

### **AI & Services**
- ![HuggingFace](https://img.shields.io/badge/🤗-HuggingFace-yellow) - AI model integration
- **Nodemailer** - Professional email service with multiple providers
- **Crypto** - Secure token generation for email verification

### **DevOps & Deployment**
- ![Git](https://img.shields.io/badge/Git-Workflow-red?logo=git) - Professional branching strategy
- **Environment Configuration** - Secure environment variable management
- **RESTful API Design** - Clean, scalable API architecture

## � Quick Start

### **Prerequisites**
- ![Node.js](https://img.shields.io/badge/Node.js-16+-green?logo=node.js) (v16 or higher)
- ![MongoDB](https://img.shields.io/badge/MongoDB-5+-green?logo=mongodb) (local or Atlas)
- ![npm](https://img.shields.io/badge/npm-8+-red?logo=npm) or yarn package manager

### **1. Clone & Setup**
```bash
# Clone the repository
git clone https://github.com/Praveensureshkumar/mock-interview-platform.git
cd mock-interview-platform

# Install server dependencies
cd server && npm install

# Install client dependencies  
cd ../client && npm install
```

### **2. Environment Configuration**
Create environment files based on the examples:

**Server Environment** (`server/.env`):
```env
# Database
MONGO_URI=mongodb://localhost:27017/mockInterviewDB

# Server Configuration
PORT=5001
NODE_ENV=development

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Email Service (Choose one)
EMAIL_SERVICE=console  # Options: console, gmail, ethereal, sendgrid

# For Gmail (if using EMAIL_SERVICE=gmail)
EMAIL_FROM=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# For SendGrid (if using EMAIL_SERVICE=sendgrid)
SENDGRID_API_KEY=your-sendgrid-api-key

# Security
BCRYPT_ROUNDS=12
```

**Client Environment** (`client/.env`):
```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_APP_NAME=Mock Interview Platform
```

### **3. Database Setup**
```bash
# If using local MongoDB, start the service
# Windows: Start MongoDB service
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# The application will automatically create the database
```

### **4. Launch Application**
```bash
# Terminal 1: Start backend server
cd server
npm run dev

# Terminal 2: Start frontend client  
cd client
npm start
```

🎉 **Application URLs:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **Email Console**: Check terminal for email verification links

## 📁 Project Architecture

```
mock-interview-platform/
├── 📂 client/                          # React Frontend Application
│   ├── 📂 public/                      # Static assets and HTML template
│   ├── 📂 src/
│   │   ├── 📂 components/              # Reusable React components
│   │   │   ├── Navbar.js              # Navigation with theme toggle
│   │   │   └── VoiceInput.js           # Voice recognition component
│   │   ├── 📂 context/                 # React Context providers
│   │   │   ├── AuthContext.js          # Authentication state management
│   │   │   └── ThemeContext.js         # Dark/Light theme provider
│   │   ├── 📂 pages/                   # Main application pages
│   │   │   ├── AuthPage.js             # Login/Register with validation
│   │   │   ├── HomePage.js             # Dashboard and interview start
│   │   │   ├── InterviewPage.js        # Core interview interface
│   │   │   ├── ProfilePage.js          # User profile and settings
│   │   │   ├── EmailVerificationPage.js # Email verification handling
│   │   │   ├── ForgotPasswordPage.js   # Password reset request
│   │   │   └── ResetPasswordPage.js    # Password reset form
│   │   ├── 📂 utils/                   # Utility functions
│   │   │   └── api.js                  # Axios configuration and API calls
│   │   └── App.js                      # Main application router
│   └── package.json                    # Frontend dependencies
├── 📂 server/                          # Node.js Backend Application  
│   ├── 📂 models/                      # MongoDB data models
│   │   ├── User.js                     # User schema with auth features
│   │   └── Question.js                 # Interview questions schema
│   ├── 📂 routes/                      # Express.js API endpoints
│   │   ├── auth.js                     # Authentication & email routes
│   │   ├── interview.js                # Interview management API
│   │   └── admin.js                    # Admin panel endpoints
│   ├── 📂 services/                    # Business logic services
│   │   ├── emailService.js             # Multi-provider email service
│   │   └── huggingFaceService.js       # AI integration service
│   ├── 📂 middleware/                  # Custom Express middleware
│   │   └── auth.js                     # JWT authentication middleware
│   ├── index.js                        # Server entry point
│   └── package.json                    # Backend dependencies
├── 📂 docs/                            # Project documentation
│   ├── EMAIL_SETUP.md                  # Email service configuration
│   ├── TESTING_GUIDE.md                # Testing instructions
│   └── DEPLOYMENT.md                   # Deployment guidelines
├── .env.example                        # Environment template
├── .gitignore                          # Git ignore patterns
└── README.md                           # Project documentation
```

## 🔧 Development Workflow

### **Git Branching Strategy**
```bash
main        # 🚀 Production branch (CI/CD deployment)
development # 🔧 Active development and testing
```

### **Development Process**
1. **Feature Development**: Work on `development` branch
2. **Testing**: Comprehensive testing on `development`
3. **Production Release**: Merge `development` → `main`
4. **Deployment**: CI/CD automatically deploys from `main`

### **Available Scripts**
```bash
# Backend Development
cd server
npm run dev          # Start with nodemon (auto-reload)
npm start           # Production start
npm run seed        # Seed database with sample questions

# Frontend Development  
cd client
npm start           # Development server with hot reload
npm run build       # Production build
npm test            # Run test suite
```

## � Testing & Quality Assurance

### **Email System Testing**
```bash
# Test email verification flow
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!"}'

# Check console for verification link or check email
```

### **API Testing**
- **Postman Collection**: Available in `docs/api-collection.json`
- **Automated Tests**: Run with `npm test` in server directory
- **Email Templates**: Preview in `docs/email-templates/`

## 🚀 Deployment

### **Environment Setup**
- **Development**: Console email logging (free)
- **Staging**: Ethereal email testing (free)  
- **Production**: Gmail SMTP or SendGrid

### **Deployment Options**
- **Frontend**: Vercel, Netlify, AWS S3
- **Backend**: Heroku, Railway, DigitalOcean
- **Database**: MongoDB Atlas (free tier available)

### **CI/CD Pipeline**
```yaml
# Example GitHub Actions workflow
name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Cloud
        # Your deployment steps here
```

## 📱 Features Showcase

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 **Authentication** | JWT-based with email verification | ✅ Complete |
| 📧 **Email System** | Multi-provider with HTML templates | ✅ Complete |
| 🎤 **Voice Recognition** | Browser-native speech API | ✅ Complete |
| 🤖 **AI Integration** | HuggingFace model integration | ✅ Complete |
| 🎨 **Theme Support** | Dark/Light mode toggle | ✅ Complete |
| 📊 **Analytics** | Interview performance tracking | ✅ Complete |
| 🔄 **Real-time** | Live interview feedback | ✅ Complete |
| 📱 **Responsive** | Mobile-optimized design | ✅ Complete |

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### **Development Setup**
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Submit Pull Request to `development` branch

### **Code Standards**
- **Frontend**: ESLint + Prettier configuration
- **Backend**: Node.js best practices
- **Database**: Mongoose schema validation
- **Security**: JWT best practices, input validation

## � License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 👨‍� About the Developer

**Praveen Suresh Kumar**
- 💼 **LinkedIn**: https://www.linkedin.com/in/praveensureshkumar/
- 📧 **Email**: praveensuresh2024@example.com
- 🐙 **GitHub**: https://github.com/Praveensureshkumar

## 🙏 Acknowledgments

- **HuggingFace** for AI model integration
- **MongoDB** for database solutions
- **React Team** for the amazing framework
- **Tailwind CSS** for beautiful styling
- **Open Source Community** for inspiration

---

### 🌟 **Star this repo if you find it helpful!**

[![GitHub Stars](https://img.shields.io/github/stars/Praveensureshkumar/mock-interview-platform?style=social)](https://github.com/Praveensureshkumar/mock-interview-platform)

**Built with ❤️ for the developer community**
