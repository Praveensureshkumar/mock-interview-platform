# AI-Powered Mock Interview Platform

## 🌟 Branch Strategy

### Branches:
- **`main`** - Production-ready code (stable releases)
- **`development`** - Development branch (active development)

## ⚙️ Local Development (No Docker)

This project can be run locally without Docker. Follow the steps below to set up and run both backend and frontend on your machine.

### Development Environment
```powershell
# Backend
cd server
npm install
npm run dev

# Frontend (in a separate terminal)
cd client
npm install
npm start
```

### Production Build (Static Frontend + Node API)
1. Build the frontend:
```powershell
cd client
npm run build
```
2. Serve the built frontend using your preferred static server (e.g., serve, nginx) and run the backend API:
```powershell
# Serve static site (optional)
npm install -g serve
serve -s build -l 3000

# Start backend
cd ../server
npm start
```

## ☁️ Cloud Deployment Options (Non-Docker Guidance)

Below are recommended cloud deployment approaches that do not require Docker images. Choose the one that fits your infrastructure and provisioning preferences.

### Option 1: Platform-as-a-Service (PaaS)
- **Heroku / Render / Vercel**: Deploy the backend as a Node.js application and frontend as a static site (Vercel recommended for React apps).
- **MongoDB Atlas**: Use a managed MongoDB cluster and connect your backend via the provided connection string.

### Option 2: Virtual Machines / Managed Instances
- **AWS EC2 / Azure VM / Google Compute Engine**: Provision a VM, install Node.js and Nginx (or serve the static build), and configure a process manager (PM2) for the backend.

### Option 3: Serverless / Managed Services
- **Serverless Functions**: Use cloud functions (Azure Functions, AWS Lambda via API Gateway) for the API endpoints if you refactor to a serverless-friendly design.
- **Static Frontend Hosting**: Use S3 + CloudFront (AWS), Azure Storage static site, or Vercel/Netlify for static builds.

## 🚀 Deployment Workflow

### Development to Production Flow:
1. **Development Branch**: Make changes in `development`
2. **Testing**: Test thoroughly in development environment
3. **Pull Request**: Create PR from `development` to `main`
4. **Code Review**: Review and approve changes
5. **Merge to Main**: Merge to main triggers production deployment
6. **Production Deploy**: Automatic deployment to cloud

## 📋 Environment Setup

### Local Development:
```bash
# Backend
cd server
npm install
npm run dev

# Frontend
cd client
npm install
npm start
```

<!-- Docker sections removed. The project provides non-Docker local and cloud deployment instructions above. -->

## 🔧 Environment Variables

Create `.env.prod` file for production:
```env
MONGO_USERNAME=your_username
MONGO_PASSWORD=secure_password
JWT_SECRET=very_long_secure_secret_key
API_URL=https://your-production-domain.com
```

## 📦 Deployment Details

- **Frontend**: Build the React app (`npm run build`) and host the static files on a static hosting service or a web server.
- **Backend**: Node.js Express API; use a process manager like `pm2` to keep the process running in production.
- **Database**: Use MongoDB Atlas or a managed MongoDB instance.

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- CORS configuration
- Environment variable protection

## 📊 Monitoring (Future)

- Add health check endpoints
- Implement logging with Winston
- Add monitoring with PM2
- Performance metrics collection