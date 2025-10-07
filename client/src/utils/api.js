import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://mock-interview-platform-w6ic.onrender.com/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interview API
export const interviewAPI = {
  // Get questions by test type and difficulty
  getQuestions: (testType, difficulty) => 
    api.get(`/interview/questions?testType=${testType}&difficulty=${difficulty}`),
  
  // Save interview result
  saveResult: (resultData) => 
    api.post('/interview/results', resultData),
  
  // Get user's interview history
  getUserResults: () => 
    api.get('/interview/user-results'),
};

// Auth API
export const authAPI = {
  login: (credentials) => 
    api.post('/auth/login', credentials),
  
  signup: (userData) => 
    api.post('/auth/signup', userData),
  
  getProfile: () => 
    api.get('/auth/profile'),
  
  verifyEmail: (token) => 
    api.get(`/auth/verify-email?token=${token}`),
  
  resendVerification: () => 
    api.post('/auth/resend-verification'),
  
  forgotPassword: (email) => 
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token, newPassword) => 
    api.post('/auth/reset-password', { token, newPassword }),
};

export default api;