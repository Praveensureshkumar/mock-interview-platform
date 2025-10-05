// Test category-specific AI question generation
require('dotenv').config();
const huggingFaceService = require('./services/huggingFaceService');

async function testCategorySpecificQuestions() {
    console.log('🧪 Testing Category-Specific AI Question Generation...\n');
    
    try {
        // Test different categories and difficulties
        const testCases = [
            { testType: 'frontend', difficulty: 'beginner' },
            { testType: 'frontend', difficulty: 'intermediate' },
            { testType: 'backend', difficulty: 'intermediate' },
            { testType: 'fullstack', difficulty: 'advanced' },
            { testType: 'react', difficulty: 'intermediate' },
            { testType: 'nodejs', difficulty: 'beginner' }
        ];
        
        for (const testCase of testCases) {
            console.log(`\n🎯 Testing: ${testCase.testType.toUpperCase()} - ${testCase.difficulty.toUpperCase()}`);
            console.log('='.repeat(60));
            
            const questions = await huggingFaceService.generateQuestions(
                testCase.testType, 
                testCase.difficulty, 
                2
            );
            
            if (questions && questions.length > 0) {
                questions.forEach((q, index) => {
                    console.log(`\n${index + 1}. ${q.question}`);
                    console.log(`   🤖 AI Generated: ${q.aiGenerated}`);
                    console.log(`   🆔 ID: ${q.uniqueId}`);
                    
                    // Check if question is category-specific
                    const categoryKeywords = {
                        frontend: ['frontend', 'React', 'component', 'UI', 'browser', 'CSS', 'responsive', 'user interface'],
                        backend: ['backend', 'API', 'server', 'database', 'authentication', 'Node.js', 'endpoint'],
                        fullstack: ['fullstack', 'frontend', 'backend', 'end-to-end', 'application'],
                        react: ['React', 'component', 'hook', 'JSX', 'state', 'props'],
                        nodejs: ['Node.js', 'server', 'JavaScript', 'npm', 'express', 'async']
                    };
                    
                    const keywords = categoryKeywords[testCase.testType] || [];
                    const hasKeyword = keywords.some(keyword => 
                        q.question.toLowerCase().includes(keyword.toLowerCase())
                    );
                    
                    console.log(`   📂 Category-Specific: ${hasKeyword ? '✅ YES' : '❌ NO'}`);
                    
                    // Check difficulty appropriateness
                    const difficultyKeywords = {
                        beginner: ['basic', 'fundamental', 'simple', 'explain', 'what is'],
                        intermediate: ['implement', 'approach', 'best practices', 'consider'],
                        advanced: ['architect', 'scale', 'enterprise', 'advanced', 'design']
                    };
                    
                    const diffKeywords = difficultyKeywords[testCase.difficulty] || [];
                    const hasDiffKeyword = diffKeywords.some(keyword => 
                        q.question.toLowerCase().includes(keyword.toLowerCase())
                    );
                    
                    console.log(`   📊 Difficulty-Appropriate: ${hasDiffKeyword ? '✅ YES' : '⚠️  MAYBE'}`);
                });
                
                console.log(`\n✅ Success: Generated ${questions.length} category-specific questions`);
            } else {
                console.log('❌ Failed to generate questions');
            }
        }
        
        console.log('\n🎉 Category-Specific Question Test Completed!\n');
        
    } catch (error) {
        console.error('❌ Test error:', error);
    }
}

testCategorySpecificQuestions();