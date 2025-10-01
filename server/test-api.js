const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

// Test Functions
async function testAPI() {
  console.log('🧪 COMPREHENSIVE API TESTING STARTED\n');

  // Test 1: Questions API
  console.log('1️⃣ Testing Questions API...');
  try {
    const response = await axios.get(`${API_BASE}/interview/questions?testType=frontend&difficulty=beginner`);
    console.log('✅ Questions API works:', response.data.questions.length, 'questions found');
  } catch (error) {
    console.log('❌ Questions API failed:', error.message);
  }

  // Test 2: Different question types
  const testCases = [
    { testType: 'backend', difficulty: 'intermediate' },
    { testType: 'fullstack', difficulty: 'advanced' },
    { testType: 'hr', difficulty: 'beginner' }
  ];

  for (const test of testCases) {
    try {
      const response = await axios.get(`${API_BASE}/interview/questions?testType=${test.testType}&difficulty=${test.difficulty}`);
      console.log(`✅ ${test.testType} ${test.difficulty}:`, response.data.questions.length, 'questions');
    } catch (error) {
      console.log(`❌ ${test.testType} ${test.difficulty} failed:`, error.response?.data?.message || error.message);
    }
  }

  // Test 3: Error handling
  console.log('\n2️⃣ Testing Error Handling...');
  try {
    await axios.get(`${API_BASE}/interview/questions?testType=invalid&difficulty=beginner`);
    console.log('❌ Should have failed with invalid testType');
  } catch (error) {
    console.log('✅ Invalid testType handled correctly:', error.response.data.message);
  }

  try {
    await axios.get(`${API_BASE}/interview/questions`);
    console.log('❌ Should have failed with missing parameters');
  } catch (error) {
    console.log('✅ Missing parameters handled correctly:', error.response.data.message);
  }

  // Test 4: User Registration
  console.log('\n3️⃣ Testing User Authentication...');
  const testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'testpass123'
  };

  try {
    const signupResponse = await axios.post(`${API_BASE}/auth/signup`, testUser);
    console.log('✅ User signup successful:', signupResponse.data.user.name);
    
    const token = signupResponse.data.token;

    // Test login with same user
    try {
      const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ User login successful:', loginResponse.data.user.name);
    } catch (error) {
      console.log('❌ Login failed:', error.response?.data?.message || error.message);
    }

    // Test profile endpoint
    try {
      const profileResponse = await axios.get(`${API_BASE}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile access successful:', profileResponse.data.user.email);
    } catch (error) {
      console.log('❌ Profile access failed:', error.response?.data?.message || error.message);
    }

  } catch (error) {
    console.log('❌ User signup failed:', error.response?.data?.message || error.message);
  }

  // Test 5: Interview Results
  console.log('\n4️⃣ Testing Interview Results...');
  const mockResult = {
    testType: 'frontend',
    difficulty: 'beginner',
    mode: 'typed',
    questions: ['507f1f77bcf86cd799439011'],
    answers: [{
      questionId: '507f1f77bcf86cd799439011',
      question: 'Test question',
      answer: 'Test answer with keywords like javascript and react',
      timestamp: new Date()
    }],
    score: 85,
    completedAt: new Date()
  };

  try {
    const resultResponse = await axios.post(`${API_BASE}/interview/results`, mockResult);
    console.log('✅ Interview result saved successfully');
  } catch (error) {
    console.log('❌ Interview result save failed:', error.response?.data?.message || error.message);
  }

  console.log('\n🎉 API TESTING COMPLETED!\n');
}

// Run tests
testAPI().catch(console.error);