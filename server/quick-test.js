const axios = require('axios');

async function quickTest() {
    try {
        console.log('Testing questions endpoint...');
        const response = await axios.get('http://localhost:5000/api/interview/questions?testType=frontend&difficulty=beginner');
        console.log('✅ SUCCESS! Questions received:');
        console.log(JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('❌ ERROR:', error.response?.data || error.message);
    }
}

quickTest();