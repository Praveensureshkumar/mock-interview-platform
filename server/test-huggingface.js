const axios = require('axios');
require('dotenv').config();

async function testHuggingFaceAPI() {
    const apiToken = process.env.HUGGINGFACE_API_TOKEN;
    const apiUrl = process.env.HUGGINGFACE_API_URL;
    
    console.log('🧪 Testing Hugging Face API...');
    console.log('API URL:', apiUrl);
    console.log('API Token:', apiToken ? `${apiToken.substring(0, 10)}...` : 'MISSING');
    
    try {
        const response = await axios.post(
            `${apiUrl}/microsoft/DialoGPT-large`,
            { 
                inputs: "Generate a simple interview question:",
                parameters: {
                    max_length: 100,
                    temperature: 0.8,
                    do_sample: true
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 15000
            }
        );
        
        console.log('✅ API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ API Error:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
        console.error('Headers:', error.response?.headers);
        return null;
    }
}

// Test the questions endpoint
async function testQuestionsEndpoint() {
    console.log('\n🧪 Testing Questions Endpoint...');
    
    // First test if server is running
    try {
        const healthResponse = await axios.get('http://localhost:5000/');
        console.log('✅ Server is running:', healthResponse.data);
    } catch (error) {
        console.error('❌ Server is not running:', error.message);
        return;
    }
    
    // Now test questions endpoint
    try {
        const response = await axios.get('http://localhost:5000/api/interview/questions?testType=frontend&difficulty=beginner');
        console.log('✅ Questions Response:', response.data);
    } catch (error) {
        console.error('❌ Questions Endpoint Error:');
        console.error('Status:', error.response?.status);
        console.error('Data:', error.response?.data);
        console.error('Message:', error.message);
    }
}

async function runTests() {
    await testHuggingFaceAPI();
    await testQuestionsEndpoint();
}

runTests();