const axios = require('axios');
require('dotenv').config();

class HuggingFaceService {
    constructor() {
        this.apiToken = process.env.HUGGINGFACE_API_TOKEN;
        this.apiUrl = process.env.HUGGINGFACE_API_URL;
        
        // Different models for different tasks
        this.models = {
            questionGeneration: 'microsoft/DialoGPT-large',
            textGeneration: 'microsoft/DialoGPT-large',
            sentimentAnalysis: 'cardiffnlp/twitter-roberta-base-sentiment-latest'
        };
    }

    // Generate interview questions using AI
    async generateQuestions(testType, difficulty, count = 2) {
        try {
            const prompts = this.createPrompts(testType, difficulty, count);
            const questions = [];

            for (const prompt of prompts) {
                const response = await this.callHuggingFaceAPI(
                    this.models.textGeneration,
                    { inputs: prompt }
                );
                
                if (response && response.generated_text) {
                    const question = this.extractQuestion(response.generated_text, prompt);
                    if (question) {
                        questions.push({
                            question: question,
                            testType: testType,
                            difficulty: difficulty,
                            aiGenerated: true,
                            category: `AI Generated ${testType.charAt(0).toUpperCase() + testType.slice(1)}`
                        });
                    }
                }
            }

            // Fallback questions if AI generation fails
            if (questions.length === 0) {
                return this.getFallbackQuestions(testType, difficulty, count);
            }

            return questions;
        } catch (error) {
            console.error('Error generating questions:', error);
            return this.getFallbackQuestions(testType, difficulty, count);
        }
    }

    // Create prompts for different test types and difficulties
    createPrompts(testType, difficulty, count) {
        const prompts = [];
        
        const promptTemplates = {
            fullstack: {
                beginner: [
                    "Generate a beginner-level full-stack developer interview question about basic web development concepts:",
                    "Create a simple full-stack interview question about HTML, CSS, and JavaScript fundamentals:"
                ],
                intermediate: [
                    "Generate an intermediate full-stack developer interview question about React and Node.js integration:",
                    "Create a full-stack interview question about database design and API development:"
                ],
                advanced: [
                    "Generate an advanced full-stack developer interview question about system architecture and scalability:",
                    "Create a complex full-stack interview question about microservices and deployment strategies:"
                ]
            },
            frontend: {
                beginner: [
                    "Generate a beginner-level frontend developer interview question about HTML and CSS:",
                    "Create a simple frontend interview question about JavaScript basics:"
                ],
                intermediate: [
                    "Generate an intermediate frontend developer interview question about React components and state management:",
                    "Create a frontend interview question about responsive design and modern CSS:"
                ],
                advanced: [
                    "Generate an advanced frontend developer interview question about performance optimization:",
                    "Create a complex frontend interview question about build tools and bundling:"
                ]
            },
            backend: {
                beginner: [
                    "Generate a beginner-level backend developer interview question about server basics:",
                    "Create a simple backend interview question about databases and APIs:"
                ],
                intermediate: [
                    "Generate an intermediate backend developer interview question about Node.js and Express:",
                    "Create a backend interview question about authentication and security:"
                ],
                advanced: [
                    "Generate an advanced backend developer interview question about system design:",
                    "Create a complex backend interview question about microservices architecture:"
                ]
            },
            hr: {
                beginner: [
                    "Generate a basic HR interview question about personal introduction:",
                    "Create a simple HR interview question about career motivation:"
                ],
                intermediate: [
                    "Generate an intermediate HR interview question about teamwork and collaboration:",
                    "Create an HR interview question about problem-solving and challenges:"
                ],
                advanced: [
                    "Generate an advanced HR interview question about leadership and decision making:",
                    "Create a complex HR interview question about conflict resolution:"
                ]
            }
        };

        const templates = promptTemplates[testType]?.[difficulty] || promptTemplates.fullstack.intermediate;
        
        for (let i = 0; i < Math.min(count, templates.length); i++) {
            prompts.push(templates[i]);
        }

        return prompts;
    }

    // Extract clean question from AI response
    extractQuestion(generatedText, originalPrompt) {
        try {
            // Remove the original prompt from the response
            let question = generatedText.replace(originalPrompt, '').trim();
            
            // Clean up the response
            question = question.split('\n')[0]; // Take first line
            question = question.replace(/^[^\w]*/, ''); // Remove leading non-word characters
            question = question.trim();
            
            // Ensure it ends with a question mark
            if (question && !question.endsWith('?')) {
                question += '?';
            }

            return question.length > 10 ? question : null;
        } catch (error) {
            console.error('Error extracting question:', error);
            return null;
        }
    }

    // Analyze user's answer using AI
    async analyzeAnswer(question, answer) {
        try {
            const sentiment = await this.analyzeSentiment(answer);
            const score = this.calculateScore(answer, sentiment);
            
            return {
                score: score,
                sentiment: sentiment,
                feedback: this.generateFeedback(score, sentiment, answer),
                analysis: {
                    length: answer.length,
                    wordCount: answer.split(' ').length,
                    confidence: sentiment.confidence || 0.7
                }
            };
        } catch (error) {
            console.error('Error analyzing answer:', error);
            return {
                score: 50,
                sentiment: { label: 'NEUTRAL', score: 0.5 },
                feedback: 'Unable to analyze answer at this time.',
                analysis: { length: answer.length, wordCount: answer.split(' ').length, confidence: 0.5 }
            };
        }
    }

    // Analyze sentiment of the answer
    async analyzeSentiment(text) {
        try {
            const response = await this.callHuggingFaceAPI(
                this.models.sentimentAnalysis,
                { inputs: text }
            );

            if (response && response[0]) {
                return {
                    label: response[0].label,
                    score: response[0].score,
                    confidence: response[0].score
                };
            }

            return { label: 'NEUTRAL', score: 0.5, confidence: 0.5 };
        } catch (error) {
            console.error('Error analyzing sentiment:', error);
            return { label: 'NEUTRAL', score: 0.5, confidence: 0.5 };
        }
    }

    // Calculate score based on answer analysis
    calculateScore(answer, sentiment) {
        let score = 50; // Base score

        // Length bonus (optimal length: 50-200 words)
        const wordCount = answer.split(' ').length;
        if (wordCount >= 50 && wordCount <= 200) {
            score += 20;
        } else if (wordCount >= 20 && wordCount < 50) {
            score += 10;
        } else if (wordCount > 200) {
            score += 5;
        }

        // Sentiment bonus
        if (sentiment.label === 'POSITIVE' || sentiment.label === 'LABEL_2') {
            score += Math.round(sentiment.score * 20);
        } else if (sentiment.label === 'NEUTRAL' || sentiment.label === 'LABEL_1') {
            score += Math.round(sentiment.score * 10);
        }

        // Technical keywords bonus (basic implementation)
        const technicalKeywords = ['javascript', 'react', 'node', 'database', 'api', 'function', 'component', 'state', 'props', 'async', 'await'];
        const foundKeywords = technicalKeywords.filter(keyword => 
            answer.toLowerCase().includes(keyword)
        ).length;
        score += foundKeywords * 3;

        return Math.min(Math.max(score, 0), 100); // Ensure score is between 0-100
    }

    // Generate feedback based on analysis
    generateFeedback(score, sentiment, answer) {
        const wordCount = answer.split(' ').length;
        let feedback = [];

        // Score-based feedback
        if (score >= 80) {
            feedback.push('Excellent answer! You demonstrated strong knowledge and communication skills.');
        } else if (score >= 60) {
            feedback.push('Good answer! You covered the main points well.');
        } else if (score >= 40) {
            feedback.push('Decent answer, but there\'s room for improvement.');
        } else {
            feedback.push('Your answer needs more detail and clarity.');
        }

        // Length feedback
        if (wordCount < 20) {
            feedback.push('Try to provide more detailed explanations.');
        } else if (wordCount > 200) {
            feedback.push('Consider being more concise in your responses.');
        }

        // Sentiment feedback
        if (sentiment.label === 'NEGATIVE' || sentiment.label === 'LABEL_0') {
            feedback.push('Try to maintain a more positive and confident tone.');
        }

        return feedback.join(' ');
    }

    // Fallback questions when AI generation fails
    getFallbackQuestions(testType, difficulty, count) {
        const fallbackQuestions = {
            fullstack: {
                beginner: [
                    "What is the difference between frontend and backend development?",
                    "Explain what a database is and why it's important in web development."
                ],
                intermediate: [
                    "How do you handle state management in a React application?",
                    "What is the purpose of middleware in Express.js?"
                ],
                advanced: [
                    "How would you design a scalable microservices architecture?",
                    "Explain the concepts of load balancing and horizontal scaling."
                ]
            },
            frontend: {
                beginner: [
                    "What is the difference between HTML, CSS, and JavaScript?",
                    "How do you make a website responsive?"
                ],
                intermediate: [
                    "What are React hooks and how do you use them?",
                    "Explain the concept of the virtual DOM."
                ],
                advanced: [
                    "How do you optimize the performance of a React application?",
                    "What are the benefits of using a bundler like Webpack?"
                ]
            },
            backend: {
                beginner: [
                    "What is an API and how does it work?",
                    "Explain the difference between SQL and NoSQL databases."
                ],
                intermediate: [
                    "How do you implement authentication in a Node.js application?",
                    "What is the purpose of environment variables?"
                ],
                advanced: [
                    "How would you design a system to handle millions of users?",
                    "Explain the concept of database indexing and its benefits."
                ]
            },
            hr: {
                beginner: [
                    "Tell me about yourself and your background.",
                    "Why are you interested in this position?"
                ],
                intermediate: [
                    "Describe a challenging project you worked on and how you overcame obstacles.",
                    "How do you handle working in a team environment?"
                ],
                advanced: [
                    "Tell me about a time when you had to lead a project or team.",
                    "How do you handle conflicts with team members or stakeholders?"
                ]
            }
        };

        const questions = fallbackQuestions[testType]?.[difficulty] || fallbackQuestions.fullstack.intermediate;
        
        return questions.slice(0, count).map(question => ({
            question: question,
            testType: testType,
            difficulty: difficulty,
            aiGenerated: false,
            category: `Fallback ${testType.charAt(0).toUpperCase() + testType.slice(1)}`
        }));
    }

    // Generic API call to Hugging Face
    async callHuggingFaceAPI(model, data) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/${model}`,
                data,
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 second timeout
                }
            );

            return response.data;
        } catch (error) {
            console.error(`Error calling Hugging Face API for model ${model}:`, error.message);
            throw error;
        }
    }
}

module.exports = new HuggingFaceService();