const axios = require('axios');
require('dotenv').config();

console.log('🔄 Loading HuggingFaceService...');

class HuggingFaceService {
    constructor() {
        console.log('🎯 HuggingFaceService constructor called');
        this.apiToken = process.env.HUGGINGFACE_API_TOKEN;
        this.apiUrl = process.env.HUGGINGFACE_API_URL;
        console.log('✅ HuggingFaceService initialized');
    }

    // Main entry point for generating questions
    async generateQuestions(testType, difficulty, count = 2) {
        console.log(`🤖 Generating specific AI questions for ${testType.toUpperCase()} - ${difficulty.toUpperCase()} (count: ${count})`);
        
        try {
            console.log(`🎯 Using category-specific question generation for ${testType}...`);
            const questions = await this.generateIntelligentQuestions(testType, difficulty, count);
            
            if (questions && questions.length > 0) {
                console.log(`✅ Generated ${questions.length} category-specific ${testType} questions successfully`);
                return questions;
            }
            
            console.log('⚠️ Intelligent generation failed, using enhanced fallback...');
            return this.generateCategorySpecificFallback(testType, difficulty, count);
            
        } catch (error) {
            console.error('❌ Error in generateQuestions:', error.message);
            return this.generateCategorySpecificFallback(testType, difficulty, count);
        }
    }

    // Generate intelligent category-specific questions
    async generateIntelligentQuestions(testType, difficulty, count) {
        try {
            console.log(`🧠 Generating intelligent questions specifically for ${testType.toUpperCase()} at ${difficulty.toUpperCase()} level`);
            
            const questions = [];
            const templates = this.getIntelligentTemplates(testType, difficulty);
            const concepts = this.getTechnologyConcepts(testType);
            const scenarios = this.getRealWorldScenarios(testType, difficulty);
            
            if (!templates || (!templates.problemSolving && !templates.explanation)) {
                console.log(`⚠️ No specific templates found for ${testType}, using fallback`);
                return null;
            }
            
            for (let i = 0; i < count; i++) {
                let question = '';
                const questionType = Math.random();
                
                if (questionType < 0.3 && scenarios && scenarios.length > 0) {
                    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
                    const concept = concepts[Math.floor(Math.random() * concepts.length)];
                    question = `${scenario} How would you implement ${concept} in this context for a ${difficulty} level ${testType} solution?`;
                    
                } else if (questionType < 0.6 && templates.problemSolving) {
                    const template = templates.problemSolving[Math.floor(Math.random() * templates.problemSolving.length)];
                    const concept = concepts[Math.floor(Math.random() * concepts.length)];
                    question = template.replace('{concept}', concept).replace('{difficulty}', difficulty);
                    
                } else if (templates.explanation) {
                    const template = templates.explanation[Math.floor(Math.random() * templates.explanation.length)];
                    const concepts_pair = this.getConceptPairs(testType);
                    if (concepts_pair && concepts_pair.length > 0) {
                        const pair = concepts_pair[Math.floor(Math.random() * concepts_pair.length)];
                        question = template.replace('{concept1}', pair[0]).replace('{concept2}', pair[1]);
                    } else {
                        const concept = concepts[Math.floor(Math.random() * concepts.length)];
                        question = `Explain ${concept} in the context of ${testType} development at ${difficulty} level.`;
                    }
                } else {
                    const concept = concepts[Math.floor(Math.random() * concepts.length)];
                    question = `How would you approach ${concept} in ${testType} development? Consider ${difficulty} level requirements.`;
                }
                
                question = this.addCategorySpecificVariations(question, testType, difficulty);
                
                questions.push({
                    question: question,
                    aiGenerated: true,
                    uniqueId: `intelligent_${testType}_${difficulty}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                });
                
                console.log(`Generated Intelligent ${testType.toUpperCase()} Question ${i + 1}: ${question}`);
                
                if (i < count - 1) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                }
            }
            
            return questions;
        } catch (error) {
            console.error('❌ Intelligent question generation failed:', error);
            return null;
        }
    }

    // Add category and difficulty specific variations
    addCategorySpecificVariations(question, testType, difficulty) {
        const categoryPrefixes = {
            fullstack: ["As a fullstack developer,", "When building end-to-end solutions,", "Considering both frontend and backend,"],
            frontend: ["From a frontend perspective,", "When focusing on user experience,", "In client-side development,"],
            backend: ["From a server-side perspective,", "When building APIs and services,", "In backend architecture,"],
            python: ["In Python development,", "When coding in Python,", "Using Python best practices,"],
            javascript: ["In JavaScript programming,", "When working with JavaScript,", "Using modern JavaScript techniques,"],
            sql: ["In database development,", "When working with databases,", "Considering data management,"],
            react: ["In React development,", "When building React applications,", "Using React best practices,"],
            nodejs: ["In Node.js development,", "When building server-side JavaScript,", "Using Node.js capabilities,"]
        };
        
        const difficultyEndings = {
            beginner: " Explain the fundamentals clearly.",
            intermediate: " Consider best practices and potential challenges.",
            advanced: " Design for enterprise-scale and discuss advanced techniques."
        };
        
        const prefixes = categoryPrefixes[testType] || categoryPrefixes.fullstack;
        const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
        const ending = difficultyEndings[difficulty] || difficultyEndings.intermediate;
        
        return `${prefix} ${question}${ending}`;
    }

    // Generate category-specific fallback questions
    generateCategorySpecificFallback(testType, difficulty, count) {
        console.log(`🎯 Generating category-specific fallback for ${testType.toUpperCase()} - ${difficulty.toUpperCase()}`);
        
        const questions = [];
        const templates = this.getAdvancedAITemplates(testType, difficulty);
        
        if (!templates || templates.length === 0) {
            return this.generateBasicCategoryQuestions(testType, difficulty, count);
        }
        
        const aiPromptStyles = [
            "From a practical standpoint,",
            "Considering modern best practices,", 
            "In today's development landscape,",
            "From an industry perspective,",
            "Taking into account current trends,"
        ];
        
        for (let i = 0; i < count; i++) {
            const template = templates[Math.floor(Math.random() * templates.length)];
            const aiPrefix = aiPromptStyles[Math.floor(Math.random() * aiPromptStyles.length)];
            const finalQuestion = `${aiPrefix} ${template} ${this.getDifficultyEnhancement(difficulty)}`;
            const uniqueId = `category_${testType}_${difficulty}_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 5)}`;
            
            questions.push({
                question: finalQuestion,
                aiGenerated: true,
                uniqueId: uniqueId
            });
            
            console.log(`Generated ${testType.toUpperCase()} Question ${i + 1}: ${finalQuestion}`);
        }
        
        return questions;
    }

    // Generate basic questions when no templates found
    generateBasicCategoryQuestions(testType, difficulty, count) {
        console.log(`🔧 Generating basic ${testType} questions for ${difficulty} level`);
        
        const basicQuestions = {
            fullstack: {
                beginner: [
                    "Explain the difference between frontend and backend development and how they work together.",
                    "How would you approach building a simple web application from scratch?",
                    "What are the key components needed for a fullstack web application?"
                ],
                intermediate: [
                    "How would you design and implement authentication in a fullstack application?",
                    "Explain your approach to managing state between frontend and backend.",
                    "How would you optimize the performance of a fullstack web application?"
                ],
                advanced: [
                    "Design a scalable architecture for a high-traffic web application.",
                    "How would you implement real-time features in a distributed system?",
                    "Explain your strategy for microservices communication and data consistency."
                ]
            },
            frontend: {
                beginner: [
                    "What are the fundamental technologies needed for frontend development?",
                    "How do you make a website responsive across different devices?",
                    "Explain the role of JavaScript in modern web development."
                ],
                intermediate: [
                    "How would you manage complex state in a React application?",
                    "Explain your approach to optimizing frontend performance.",
                    "How do you ensure cross-browser compatibility in your applications?"
                ],
                advanced: [
                    "Design a component architecture for a large-scale frontend application.",
                    "How would you implement advanced animations and user interactions?",
                    "Explain your strategy for code splitting and lazy loading."
                ]
            },
            backend: {
                beginner: [
                    "What is an API and how do you design RESTful endpoints?",
                    "Explain the basics of database design and relationships.",
                    "How do you handle user authentication and authorization?"
                ],
                intermediate: [
                    "How would you optimize database queries for better performance?",
                    "Explain your approach to error handling and logging.",
                    "How do you design APIs that can scale with increasing traffic?"
                ],
                advanced: [
                    "Design a distributed system architecture for high availability.",
                    "How would you implement caching strategies for optimal performance?",
                    "Explain your approach to database sharding and replication."
                ]
            },
            react: {
                beginner: [
                    "What are React components and how do you create them?",
                    "Explain the concept of props and state in React.",
                    "How do you handle events in React applications?"
                ],
                intermediate: [
                    "How would you manage complex state using hooks?",
                    "Explain the React component lifecycle and useEffect.",
                    "How do you optimize React application performance?"
                ],
                advanced: [
                    "How would you implement a custom hook for complex logic?",
                    "Explain advanced patterns like render props and HOCs.",
                    "How do you handle server-side rendering with React?"
                ]
            },
            nodejs: {
                beginner: [
                    "What is Node.js and how does it differ from browser JavaScript?",
                    "How do you create a basic HTTP server in Node.js?",
                    "Explain the concept of modules and require in Node.js."
                ],
                intermediate: [
                    "How would you handle asynchronous operations in Node.js?",
                    "Explain middleware and how to use it in Express.js.",
                    "How do you manage environment variables and configuration?"
                ],
                advanced: [
                    "How would you optimize Node.js application performance?",
                    "Explain clustering and load balancing in Node.js.",
                    "How do you handle memory leaks and debugging in production?"
                ]
            },
            python: {
                beginner: [
                    "What are the basic data types in Python and how do you use them?",
                    "Explain the difference between lists, tuples, and dictionaries.",
                    "How do you handle errors and exceptions in Python?"
                ],
                intermediate: [
                    "Explain decorators in Python and provide practical examples.",
                    "How would you implement object-oriented programming in Python?",
                    "What are generators and when would you use them?"
                ],
                advanced: [
                    "How would you optimize Python code for better performance?",
                    "Explain metaclasses and their use cases in Python.",
                    "How do you implement design patterns in Python applications?"
                ]
            },
            javascript: {
                beginner: [
                    "What are the different ways to declare variables in JavaScript?",
                    "Explain the difference between == and === operators.",
                    "How do you work with arrays and objects in JavaScript?"
                ],
                intermediate: [
                    "Explain closures and their practical applications.",
                    "How do you handle asynchronous operations with Promises?",
                    "What are the differences between arrow functions and regular functions?"
                ],
                advanced: [
                    "How would you implement a custom Promise from scratch?",
                    "Explain event loop and how JavaScript handles concurrency.",
                    "How do you optimize JavaScript performance in large applications?"
                ]
            },
            sql: {
                beginner: [
                    "What are the basic SQL commands and how do you use them?",
                    "Explain the difference between SQL and NoSQL databases.",
                    "How do you create and modify database tables?"
                ],
                intermediate: [
                    "Explain different types of JOINs and when to use each.",
                    "How would you optimize slow database queries?",
                    "What are indexes and how do they improve performance?"
                ],
                advanced: [
                    "How would you design a database schema for a complex application?",
                    "Explain ACID properties and transaction management.",
                    "How do you implement database partitioning and sharding?"
                ]
            }
        };
        
        const categoryQuestions = basicQuestions[testType]?.[difficulty] || basicQuestions.fullstack.intermediate;
        const questions = [];
        
        for (let i = 0; i < count; i++) {
            const questionText = categoryQuestions[i % categoryQuestions.length];
            const uniqueId = `basic_${testType}_${difficulty}_${Date.now()}_${i}`;
            
            questions.push({
                question: questionText,
                aiGenerated: true,
                uniqueId: uniqueId
            });
            
            console.log(`Generated Basic ${testType.toUpperCase()} Question ${i + 1}: ${questionText}`);
        }
        
        return questions;
    }

    // Get difficulty-specific enhancements
    getDifficultyEnhancement(difficulty) {
        const enhancements = {
            beginner: "Explain your approach step by step.",
            intermediate: "Consider the trade-offs and explain your reasoning.",
            advanced: "Design for scale and discuss potential challenges."
        };
        
        return enhancements[difficulty] || "Explain your approach.";
    }

    // Get intelligent question templates
    getIntelligentTemplates(testType, difficulty) {
        const templates = {
            problemSolving: [
                "You're working on a {difficulty} level project and need to optimize {concept}. What approach would you take?",
                "A client reports performance issues with {concept}. How would you diagnose and fix this?",
                "You need to implement {concept} in a scalable way. What factors would you consider?",
                "Your team is debating between different approaches for {concept}. How would you make the decision?",
                "You're reviewing code that implements {concept} poorly. What improvements would you suggest?"
            ],
            explanation: [
                "Compare and contrast {concept1} versus {concept2}. When would you choose one over the other?",
                "Explain the relationship between {concept1} and {concept2} in modern development.",
                "What are the pros and cons of using {concept1} compared to {concept2}?",
                "How do {concept1} and {concept2} work together in a typical application?",
                "Describe the evolution from {concept1} to {concept2} and why it matters."
            ]
        };
        
        return templates;
    }

    // Get technology-specific concepts
    getTechnologyConcepts(testType) {
        const concepts = {
            fullstack: ['state management', 'API design', 'database optimization', 'caching strategies', 'authentication systems', 'microservices architecture', 'CI/CD pipelines', 'testing strategies', 'performance monitoring', 'security best practices'],
            frontend: ['component lifecycle', 'state management', 'routing', 'performance optimization', 'accessibility', 'responsive design', 'webpack configuration', 'testing components', 'PWA features', 'SEO optimization'],
            backend: ['API design', 'database modeling', 'authentication', 'caching', 'logging', 'error handling', 'scalability', 'security', 'testing', 'deployment'],
            python: ['data structures', 'algorithms', 'OOP concepts', 'decorators', 'generators', 'list comprehensions', 'error handling', 'modules and packages', 'virtual environments', 'Django/Flask frameworks'],
            javascript: ['closures', 'prototypes', 'async/await', 'promises', 'ES6+ features', 'DOM manipulation', 'event handling', 'modules', 'arrow functions', 'destructuring'],
            sql: ['database design', 'normalization', 'joins', 'indexing', 'query optimization', 'stored procedures', 'transactions', 'NoSQL concepts', 'data modeling', 'performance tuning'],
            react: ['hooks', 'context API', 'component composition', 'performance optimization', 'state management', 'lifecycle methods', 'testing', 'routing', 'forms', 'SSR'],
            nodejs: ['event loop', 'streams', 'clustering', 'middleware', 'authentication', 'database connections', 'error handling', 'testing', 'performance', 'security']
        };
        
        return concepts[testType] || concepts.fullstack;
    }

    // Get concept pairs for comparison questions
    getConceptPairs(testType) {
        const pairs = {
            fullstack: [['REST APIs', 'GraphQL'], ['SQL', 'NoSQL'], ['Server-side rendering', 'Client-side rendering'], ['Monolith', 'Microservices'], ['Session-based auth', 'JWT tokens']],
            frontend: [['React', 'Vue'], ['CSS Grid', 'Flexbox'], ['Local state', 'Global state'], ['Class components', 'Functional components'], ['SPA', 'MPA']],
            backend: [['REST', 'GraphQL'], ['Relational DB', 'Document DB'], ['Synchronous', 'Asynchronous'], ['Monolith', 'Microservices'], ['Horizontal scaling', 'Vertical scaling']],
            python: [['Lists', 'Tuples'], ['Inheritance', 'Composition'], ['Django', 'Flask'], ['Synchronous', 'Asynchronous'], ['Mutable', 'Immutable']],
            javascript: [['var', 'let/const'], ['Callbacks', 'Promises'], ['Arrow functions', 'Regular functions'], ['Map', 'Filter'], ['Synchronous', 'Asynchronous']],
            sql: [['SQL', 'NoSQL'], ['INNER JOIN', 'LEFT JOIN'], ['Clustered', 'Non-clustered indexes'], ['ACID', 'BASE'], ['Normalization', 'Denormalization']],
            react: [['Class components', 'Functional components'], ['useState', 'useReducer'], ['Props', 'State'], ['Context', 'Redux'], ['SSR', 'CSR']],
            nodejs: [['Callbacks', 'Promises'], ['Cluster', 'Worker threads'], ['Express', 'Fastify'], ['MongoDB', 'PostgreSQL'], ['Sync', 'Async']]
        };
        
        return pairs[testType] || pairs.fullstack;
    }

    // Get real-world scenarios
    getRealWorldScenarios(testType, difficulty) {
        const scenarios = [
            "You're building an e-commerce platform that needs to handle high traffic during sales events.",
            "Your startup is creating a social media app that needs real-time features.",
            "A financial company wants a secure web application for managing customer accounts.",
            "You're developing a content management system for a news organization.",
            "Your team is building a dashboard for monitoring IoT devices.",
            "A client needs a booking system for their restaurant chain.",
            "You're creating an educational platform with video streaming capabilities.",
            "Your company is building an internal tool for project management."
        ];
        
        return scenarios;
    }

    // Get advanced AI-style templates
    getAdvancedAITemplates(testType, difficulty) {
        const templates = {
            fullstack: {
                beginner: ["a client wants a simple web application with user authentication - how would you structure the project?", "you need to explain the relationship between frontend and backend to a stakeholder - what key points would you cover?", "a team is starting their first fullstack project - what fundamental concepts should they master first?"],
                intermediate: ["a client wants real-time features in their web app - what technologies would you recommend and why?", "you're designing an API that needs to handle both mobile and web clients - what architectural decisions would you make?", "a company needs to scale their web application to handle 10x more users - what strategies would you implement?"],
                advanced: ["a fintech startup needs a highly secure and scalable platform - how would you architect the entire system?", "you're leading a team to migrate a monolithic application to microservices - what's your strategic approach?", "a global company needs real-time data synchronization across multiple regions - how would you design this system?"]
            },
            frontend: {
                beginner: ["a client wants their website to work on all devices - how would you approach responsive design?", "you need to make a website interactive without a framework - what JavaScript concepts are essential?", "a business owner wants their site to load faster - what optimization techniques would you implement?"],
                intermediate: ["a team is debating between React and Vue for their new project - how would you help them decide?", "you need to implement complex state management in a React app - what options would you consider?", "a client reports that their website feels slow and unresponsive - how would you diagnose and fix this?"],
                advanced: ["you need to build a high-performance web application that handles real-time data - what architecture would you choose?", "a company wants to implement micro-frontends for their large-scale application - how would you design this?", "you're optimizing a complex React application for maximum performance - what advanced techniques would you use?"]
            },
            backend: {
                beginner: ["a startup needs their first API to handle user registration and login - how would you design it?", "you need to choose between SQL and NoSQL for a new project - what factors would guide your decision?", "a client wants to understand how their data is stored and retrieved - how would you explain database concepts?"],
                intermediate: ["a growing company is experiencing database performance issues - how would you approach optimization?", "you need to design an API that can handle sudden traffic spikes - what strategies would you implement?", "a team wants to implement proper error handling and logging - what best practices would you recommend?"],
                advanced: ["a large enterprise needs a distributed system that can handle millions of requests - how would you architect it?", "you're designing a event-driven architecture for a complex business domain - what patterns would you use?", "a company needs to implement real-time analytics on massive datasets - what technologies and approaches would you consider?"]
            },
            react: {
                beginner: ["you're building your first React component - what principles should guide your approach?", "a team member is confused about when to use state vs props - how would you explain the difference?", "you need to handle user input in a React form - what's your approach?"],
                intermediate: ["you're implementing a complex form with validation in React - what strategies would you use?", "a React app is becoming slow with many components - how would you optimize performance?", "you need to share data between components that aren't parent-child - what solutions would you consider?"],
                advanced: ["you're building a React app that needs server-side rendering - how would you implement this?", "a team wants to implement advanced state management patterns - what options would you recommend?", "you need to create a reusable component library for multiple projects - what's your architecture?"]
            },
            nodejs: {
                beginner: ["you're setting up your first Node.js server - what are the essential steps?", "a client wants to understand how Node.js handles multiple requests - how would you explain it?", "you need to connect a Node.js app to a database - what's your approach?"],
                intermediate: ["you're building a REST API with Express.js - what best practices would you follow?", "a Node.js app is running out of memory - how would you diagnose and fix this?", "you need to implement authentication in a Node.js application - what strategies would you use?"],
                advanced: ["you're optimizing a Node.js app for high concurrency - what techniques would you employ?", "a team needs to implement real-time features with Node.js - what's your architecture?", "you're building a Node.js microservice that needs to be highly available - how would you design it?"]
            },
            python: {
                beginner: ["you're starting your first Python project - what are the essential concepts to master?", "a client wants a simple data processing script - how would you structure it in Python?", "you need to explain Python's philosophy to a new developer - what key principles would you cover?"],
                intermediate: ["you're building a web application with Django - what architectural decisions would you make?", "a team needs to process large datasets efficiently - what Python tools and techniques would you recommend?", "you need to implement automated testing for a Python application - what's your strategy?"],
                advanced: ["you're designing a high-performance Python system for real-time data processing - what approaches would you take?", "a company needs to scale their Python application to handle millions of users - how would you architect it?", "you're optimizing Python code for maximum performance - what advanced techniques would you employ?"]
            },
            javascript: {
                beginner: ["you're teaching modern JavaScript to a beginner - what essential concepts should they learn first?", "a client wants interactive features on their website - how would you implement them with vanilla JavaScript?", "you need to debug a JavaScript application - what tools and techniques would you use?"],
                intermediate: ["you're building a single-page application with modern JavaScript - what patterns would you follow?", "a team is struggling with asynchronous JavaScript - how would you help them understand and implement it properly?", "you need to optimize JavaScript performance in a large application - what strategies would you use?"],
                advanced: ["you're architecting a complex JavaScript application with multiple modules - how would you structure it?", "a company needs real-time features in their web app - how would you implement them with JavaScript?", "you're implementing advanced JavaScript patterns for a large team - what guidelines would you establish?"]
            },
            sql: {
                beginner: ["you're designing your first database schema - what principles should guide your approach?", "a client needs to store and retrieve customer data - how would you design the database structure?", "you need to explain the difference between SQL and NoSQL to a stakeholder - what key points would you cover?"],
                intermediate: ["you're optimizing a slow-performing database - what steps would you take to identify and fix issues?", "a growing application is experiencing database bottlenecks - how would you scale the data layer?", "you need to implement data backup and recovery strategies - what approaches would you recommend?"],
                advanced: ["you're designing a distributed database system for a global application - what challenges would you address?", "a company needs to implement real-time analytics on massive datasets - how would you architect the data infrastructure?", "you're migrating from a monolithic database to a microservices data architecture - what's your strategy?"]
            }
        };
        
        return templates[testType]?.[difficulty] || templates.fullstack.intermediate;
    }

    // Generate unique variation of a question template
    generateQuestionVariation(template, testType, difficulty) {
        const enhancements = [
            "Include any potential challenges you might face.",
            "Consider the trade-offs and explain your reasoning.",
            "What would be your preferred approach and why?",
            "Discuss the implications for maintainability and scalability.",
            "How would you ensure this solution is production-ready?",
            "What factors would influence your technical decisions?",
            "How would you communicate your approach to non-technical stakeholders?",
            "What testing strategies would you implement?"
        ];
        
        const enhancement = enhancements[Math.floor(Math.random() * enhancements.length)];
        return `${template} ${enhancement}`;
    }

    // AI Answer Analysis
    async analyzeAnswer(question, answer) {
        console.log(`🧠 Analyzing answer with AI for question: "${question.substring(0, 50)}..."`);
        
        try {
            const sentimentResponse = await this.callHuggingFaceAPI('cardiffnlp/twitter-roberta-base-sentiment-latest', {
                inputs: answer
            });

            let sentiment = 'positive';
            if (sentimentResponse && sentimentResponse.length > 0) {
                const sentiments = sentimentResponse[0];
                const topSentiment = sentiments.reduce((prev, current) => 
                    (prev.score > current.score) ? prev : current
                );
                sentiment = topSentiment.label.toLowerCase();
            }

            const baseScore = this.sentimentToScore(sentiment);
            const lengthBonus = Math.min(20, answer.length / 10);
            const finalScore = Math.min(100, Math.max(0, baseScore + lengthBonus));

            return {
                score: Math.round(finalScore),
                sentiment: sentiment,
                feedback: this.generateSmartFeedback(finalScore, answer, question),
                confidence: 0.7,
                keywords: this.extractTechnicalKeywords(answer)
            };
            
        } catch (error) {
            console.error('❌ Error in analyzeAnswer:', error);
            return this.intelligentAnswerAnalysis(question, answer);
        }
    }

    // Call Hugging Face API
    async callHuggingFaceAPI(model, payload) {
        const url = `${this.apiUrl}/${model}`;
        
        console.log(`🔗 Calling Hugging Face API for model: ${model}`);
        
        try {
            const response = await axios.post(url, payload, {
                headers: {
                    'Authorization': `Bearer ${this.apiToken}`,
                    'Content-Type': 'application/json',
                },
                timeout: 30000
            });
            
            console.log('✅ Hugging Face API call successful');
            return response.data;
            
        } catch (error) {
            console.error(`❌ Error calling Hugging Face API for model ${model}:`);
            console.error('Status:', error.response?.status);
            console.error('Message:', error.message);
            console.error('Response:', error.response?.statusText);
            
            throw new Error(`Hugging Face API Error: ${error.response?.status} - ${error.message}`);
        }
    }

    // Helper methods for answer analysis
    sentimentToScore(sentiment) {
        const scores = { positive: 75, neutral: 50, negative: 25 };
        return scores[sentiment] || 50;
    }

    generateSmartFeedback(score, answer, question) {
        if (score >= 80) return "Excellent answer! You demonstrated strong understanding.";
        if (score >= 60) return "Good answer! You covered the main points well.";
        if (score >= 40) return "Decent attempt. Consider adding more technical details.";
        return "Your answer could be more comprehensive. Try to elaborate on key concepts.";
    }

    extractTechnicalKeywords(answer) {
        const keywords = ['react', 'node', 'javascript', 'api', 'database', 'component', 'state', 'props', 'async', 'function'];
        return keywords.filter(keyword => answer.toLowerCase().includes(keyword));
    }

    intelligentAnswerAnalysis(question, answer) {
        const wordCount = answer.split(' ').length;
        const baseScore = Math.min(80, Math.max(20, wordCount * 2));
        
        return {
            score: baseScore,
            feedback: this.generateSmartFeedback(baseScore, answer, question),
            confidence: 0.6,
            keywords: this.extractTechnicalKeywords(answer),
            sentiment: 'neutral'
        };
    }
}

module.exports = new HuggingFaceService();