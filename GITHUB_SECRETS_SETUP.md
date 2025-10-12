# 🔐 GitHub Secrets Setup Guide

## Required Secrets for CI/CD Pipeline

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

### Backend Deployment Secrets:
```
MONGO_URI_TEST=mongodb://localhost:27017/test_mockinterviewdb
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
RENDER_DEPLOY_HOOK_BACKEND=https://api.render.com/deploy/your-service-id
BACKEND_URL=https://your-backend-app.onrender.com
```

### Frontend Deployment Secrets:
```
REACT_APP_API_URL_PROD=https://your-backend-app.onrender.com/api
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

## How to Get Each Secret:

### 1. RENDER_DEPLOY_HOOK_BACKEND
1. Go to Render dashboard
2. Select your backend service
3. Go to Settings → Deploy hooks
4. Copy the deploy hook URL

### 2. VERCEL_TOKEN
1. Go to Vercel dashboard
2. Settings → Tokens
3. Create new token with appropriate permissions

### 3. VERCEL_ORG_ID & VERCEL_PROJECT_ID
1. Run `vercel` command in your project
2. Or check `.vercel/project.json` file
3. Or find in Vercel dashboard → Project settings

### 4. BACKEND_URL
Your deployed backend URL (e.g., https://mock-interview-platform-backend.onrender.com)

### 5. MONGO_URI_TEST
Use a separate test database or local MongoDB for testing

## Branch Protection Rules

### For Main Branch:
1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - Require status checks to pass before merging
   - Require pull request reviews before merging
   - Dismiss stale PR approvals when new commits are pushed
   - Require review from code owners

### For Development Branch:
1. Add rule for `development` branch
2. Enable:
   - Require status checks to pass before merging
   - Allow force pushes (for development flexibility)

## Workflow Triggers:

### Production (main branch):
- Triggers on: Push to main, PR to main
- Runs: Tests → Deploy Backend → Deploy Frontend → Notify

### Development (development branch):
- Triggers on: Push to development, PR to development/main
- Runs: Lint → Test → Code Quality → Security Scan → Notify

## Environment Variables in Code:

### Server (.env for production):
```
MONGO_URI=your_production_mongodb_uri
PORT=5000
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-frontend-app.vercel.app
EMAIL_PROVIDER=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Client (.env for production):
```
REACT_APP_API_URL=https://your-backend-app.onrender.com/api
```