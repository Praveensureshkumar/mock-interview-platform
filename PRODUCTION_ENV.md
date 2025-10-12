# Production Environment Variables
# Copy these to your deployment platform (Render/Vercel)

# Backend (.env for Render)
MONGO_URI=your_mongodb_atlas_connection_string_here
PORT=5000
JWT_SECRET=your_production_jwt_secret_key_here_make_it_long_and_secure_for_production
HUGGINGFACE_API_TOKEN=your_huggingface_api_token_here
HUGGINGFACE_API_URL=https://api-inference.huggingface.co/models
EMAIL_PROVIDER=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_gmail_address@gmail.com
EMAIL_PASS=your_gmail_app_password_here
FROM_EMAIL=Mock Interview Platform <your_gmail_address@gmail.com>
CLIENT_URL=https://your-frontend-domain.com
NODE_ENV=production

# Frontend (.env for Vercel)
REACT_APP_API_URL=https://your-backend-domain.com/api
REACT_APP_APP_NAME=Mock Interview Platform