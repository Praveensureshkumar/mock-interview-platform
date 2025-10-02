const axios = require('axios');

// Test the AI question generation and answer analysis
async function testHuggingFaceIntegration() {
    console.log('🧪 Testing Hugging Face AI Integration...\n');
    
    const baseUrl = 'http://localhost:5000/api/interview';
    
    try {
        // Test 1: Generate questions for different categories
        const testCases = [
            { testType: 'fullstack', difficulty: 'intermediate' },
            { testType: 'frontend', difficulty: 'beginner' },
            { testType: 'backend', difficulty: 'advanced' },
            { testType: 'hr', difficulty: 'intermediate' }
        ];

        console.log('📝 Testing AI Question Generation (2 questions each):\n');
        
        for (const testCase of testCases) {
            try {
                console.log(`🔍 Testing ${testCase.testType} - ${testCase.difficulty}:`);
                
                const response = await axios.get(`${baseUrl}/questions`, {
                    params: testCase,
                    timeout: 15000 // 15 second timeout for AI calls
                });
                
                if (response.data && response.data.questions) {
                    console.log(`✅ Generated ${response.data.questions.length} questions`);
                    response.data.questions.forEach((q, index) => {
                        console.log(`   ${index + 1}. ${q.question}`);
                        console.log(`      Category: ${q.category}`);
                        console.log(`      AI Generated: ${q.aiGenerated ? 'Yes' : 'No (Fallback)'}`);
                    });
                } else {
                    console.log(`❌ No questions received`);
                }
                console.log('');
            } catch (error) {
                console.log(`❌ Error for ${testCase.testType}: ${error.message}`);
                console.log('');
            }
        }

        // Test 2: Analyze sample answers
        console.log('\n🧠 Testing AI Answer Analysis:\n');
        
        const sampleAnswers = [
            {
                question: "What is React and why is it popular?",
                answer: "React is a JavaScript library for building user interfaces. It's popular because it uses a virtual DOM which makes it fast, has reusable components, and has a large ecosystem."
            },
            {
                question: "Tell me about yourself.",
                answer: "I am a passionate full-stack developer with 3 years of experience in React and Node.js. I love solving complex problems and building scalable applications."
            }
        ];

        for (const sample of sampleAnswers) {
            try {
                console.log(`🔍 Analyzing answer for: "${sample.question}"`);
                console.log(`📝 Answer: "${sample.answer}"`);
                
                const response = await axios.post(`${baseUrl}/analyze-answer`, sample, {
                    timeout: 15000
                });
                
                if (response.data && response.data.analysis) {
                    const analysis = response.data.analysis;
                    console.log(`✅ AI Analysis Results:`);
                    console.log(`   Score: ${analysis.score}/100`);
                    console.log(`   Sentiment: ${analysis.sentiment.label} (${Math.round(analysis.sentiment.score * 100)}%)`);
                    console.log(`   Feedback: ${analysis.feedback}`);
                    console.log(`   Word Count: ${analysis.analysis.wordCount}`);
                } else {
                    console.log(`❌ No analysis received`);
                }
                console.log('');
            } catch (error) {
                console.log(`❌ Error analyzing answer: ${error.message}`);
                console.log('');
            }
        }

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
    
    console.log('🏁 Test completed!');
}

// Run the test
if (require.main === module) {
    testHuggingFaceIntegration();
}

module.exports = testHuggingFaceIntegration;