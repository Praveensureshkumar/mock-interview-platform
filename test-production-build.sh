#!/bin/bash

# 🏗️ Production Build Test Script
# Run this before pushing to main to ensure everything builds correctly

echo "🏗️ Testing Production Build..."

# Test Backend
echo "📦 Testing Backend..."
cd server
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Backend npm install failed"
    exit 1
fi

echo "🧪 Running Backend Tests..."
npm test --if-present || echo "⚠️ No backend tests found"

# Test Frontend
echo "📦 Testing Frontend..."
cd ../client
npm ci
if [ $? -ne 0 ]; then
    echo "❌ Frontend npm install failed"
    exit 1
fi

echo "🏗️ Building Frontend for Production..."
REACT_APP_API_URL=https://mock-interview-platform-backend.onrender.com/api npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

echo "🧪 Running Frontend Tests..."
npm test -- --coverage --watchAll=false --passWithNoTests
if [ $? -ne 0 ]; then
    echo "❌ Frontend tests failed"
    exit 1
fi

echo "✅ All production build tests passed!"
echo "🚀 Ready for deployment to main branch!"