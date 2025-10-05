// Test the new category-specific AI question generation for Python, JavaScript, and SQL
require('dotenv').config();
const huggingFaceService = require('./services/huggingFaceService');

async function testNewCategories() {
    console.log('🧪 Testing NEW Category-Specific AI Question Generation...\n');
    
    try {
        // Test new categories and difficulties
        const testCases = [
            { testType: 'python', difficulty: 'beginner' },
            { testType: 'python', difficulty: 'intermediate' },
            { testType: 'javascript', difficulty: 'beginner' },
            { testType: 'javascript', difficulty: 'advanced' },
            { testType: 'sql', difficulty: 'intermediate' },
            { testType: 'sql', difficulty: 'advanced' }
        ];
        
        let totalQuestions = 0;
        let successfulTests = 0;
        
        for (const testCase of testCases) {
            const { testType, difficulty } = testCase;
            
            console.log(`🎯 Testing: ${testType.toUpperCase()} - ${difficulty.toUpperCase()}`);
            console.log('='.repeat(60));
            
            try {
                const questions = await huggingFaceService.generateQuestions(testType, difficulty, 2);
                
                if (questions && questions.length > 0) {
                    totalQuestions += questions.length;
                    successfulTests++;
                    
                    // Analyze questions for category-specific content
                    questions.forEach((q, index) => {
                        console.log(`${index + 1}. ${q.question}`);
                        console.log(`   🤖 AI Generated: ${q.aiGenerated}`);
                        console.log(`   🆔 ID: ${q.uniqueId}`);
                        
                        // Check for category-specific keywords
                        const categoryKeywords = {
                            python: ['python', 'django', 'flask', 'list', 'dict', 'tuple', 'class', 'function', 'module', 'pip'],
                            javascript: ['javascript', 'js', 'var', 'let', 'const', 'function', 'object', 'array', 'dom', 'async'],
                            sql: ['sql', 'database', 'query', 'table', 'join', 'index', 'nosql', 'mongodb', 'postgresql', 'mysql']
                        };
                        
                        const keywords = categoryKeywords[testType] || [];
                        const hasKeywords = keywords.some(keyword => 
                            q.question.toLowerCase().includes(keyword)
                        );
                        
                        console.log(`   📂 Category-Specific: ${hasKeywords ? '✅ YES' : '❌ NO'}`);
                        
                        // Check for difficulty-appropriate language
                        const difficultyWords = {
                            beginner: ['basic', 'simple', 'fundamental', 'explain', 'what is', 'how do you'],
                            intermediate: ['implement', 'best practices', 'optimize', 'consider', 'approach'],
                            advanced: ['design', 'architecture', 'scale', 'enterprise', 'complex', 'advanced']
                        };
                        
                        const diffWords = difficultyWords[difficulty] || [];
                        const hasDifficultyWords = diffWords.some(word => 
                            q.question.toLowerCase().includes(word)
                        );
                        
                        console.log(`   📊 Difficulty-Appropriate: ${hasDifficultyWords ? '✅ YES' : '❌ NO'}`);
                        console.log('');
                    });
                    
                    console.log(`✅ Success: Generated ${questions.length} category-specific questions\n`);
                } else {
                    console.log('❌ Failed: No questions generated\n');
                }
                
            } catch (error) {
                console.error(`❌ Error generating questions for ${testType} - ${difficulty}:`, error.message);
                console.log('');
            }
        }
        
        console.log('🎉 NEW Category-Specific Question Test Completed!');
        console.log(`📈 Total Questions Generated: ${totalQuestions}`);
        console.log(`✅ Successful Tests: ${successfulTests}/${testCases.length}`);
        console.log(`📊 Success Rate: ${Math.round((successfulTests/testCases.length)*100)}%`);
        
    } catch (error) {
        console.error('❌ Test failed with error:', error);
    }
}

// Run the test
testNewCategories();