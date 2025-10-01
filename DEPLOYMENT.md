# AI-Powered Mock Interview Platform

## 🌟 Branch Strategy

### Branches:
- **`main`** - Production-ready code (stable releases)
- **`development`** - Development branch (active development)

## 🐳 Docker Setup

### Development Environment
```bash
# Run with Docker Compose (Development)
docker-compose up --build

# Run in detached mode
docker-compose up -d --build

# Stop services
docker-compose down
```

### Production Environment
```bash
# Setup environment variables
cp .env.example .env.prod
# Edit .env.prod with your production values

# Run production build
docker-compose -f docker-compose.prod.yml up -d --build

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

## ☁️ Cloud Deployment Options

### Option 1: AWS (Recommended)
- **ECS (Elastic Container Service)** for container orchestration
- **RDS MongoDB** or **DocumentDB** for database
- **ALB (Application Load Balancer)** for traffic distribution
- **ECR (Elastic Container Registry)** for Docker images

### Option 2: Azure
- **Azure Container Instances** or **Azure Kubernetes Service**
- **Azure Cosmos DB** (MongoDB API)
- **Azure Container Registry**

### Option 3: Google Cloud Platform
- **Google Kubernetes Engine** or **Cloud Run**
- **Cloud MongoDB Atlas**
- **Google Container Registry**

### Option 4: DigitalOcean (Budget-friendly)
- **App Platform** for easy deployment
- **Managed MongoDB**
- **Container Registry**

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

### Docker Development:
```bash
# Start all services
docker-compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## 🔧 Environment Variables

Create `.env.prod` file for production:
```env
MONGO_USERNAME=your_username
MONGO_PASSWORD=secure_password
JWT_SECRET=very_long_secure_secret_key
API_URL=https://your-production-domain.com
```

## 📦 Container Details

- **Frontend**: React app served with nginx
- **Backend**: Node.js Express API
- **Database**: MongoDB with authentication
- **Network**: Isolated Docker network for security

## 🔐 Security Features

- JWT authentication
- Password hashing with bcryptjs
- CORS configuration
- Environment variable protection
- Docker network isolation

## 📊 Monitoring (Future)

- Add health check endpoints
- Implement logging with Winston
- Add monitoring with PM2
- Performance metrics collection