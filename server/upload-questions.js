const mongoose = require('mongoose');
const Question = require('./models/Question');

// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mockInterview');
        console.log('MongoDB connected for question upload');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Your custom questions - ADD YOUR QUESTIONS HERE
const customQuestions = [
    // Full Stack Questions
    {
        question: "What is the difference between let, const, and var in JavaScript?",
        testType: "fullstack",
        difficulty: "intermediate",
        keywords: ["scope", "hoisting", "block scope", "function scope", "temporal dead zone", "immutable"],
        category: "JavaScript Fundamentals"
    },
    {
        question: "Explain the concept of closures in JavaScript with an example.",
        testType: "fullstack",
        difficulty: "advanced",
        keywords: ["closure", "lexical scope", "inner function", "outer function", "variable access", "memory"],
        category: "JavaScript Advanced"
    },
    {
        question: "What is the difference between SQL and NoSQL databases?",
        testType: "backend",
        difficulty: "intermediate",
        keywords: ["relational", "document", "schema", "ACID", "scalability", "flexibility"],
        category: "Database Systems"
    },
    {
        question: "How does React Virtual DOM work?",
        testType: "frontend",
        difficulty: "intermediate",
        keywords: ["virtual dom", "reconciliation", "diffing", "performance", "rendering", "react"],
        category: "React Framework"
    },
    {
        question: "Explain REST API principles and HTTP methods.",
        testType: "backend",
        difficulty: "intermediate",
        keywords: ["REST", "HTTP", "GET", "POST", "PUT", "DELETE", "stateless", "API design"],
        category: "API Development"
    },

    // HR Questions
    {
        question: "Tell me about yourself and your background.",
        testType: "hr",
        difficulty: "beginner",
        keywords: ["experience", "skills", "background", "passion", "goals", "achievements"],
        category: "Personal Introduction"
    },
    {
        question: "What are your biggest strengths and weaknesses?",
        testType: "hr",
        difficulty: "intermediate",
        keywords: ["strengths", "weaknesses", "improvement", "self-aware", "growth mindset"],
        category: "Self Assessment"
    },
    {
        question: "Where do you see yourself in 5 years?",
        testType: "hr",
        difficulty: "intermediate",
        keywords: ["career goals", "growth", "leadership", "skills development", "company contribution"],
        category: "Career Planning"
    },
    {
        question: "Why do you want to work for our company?",
        testType: "hr",
        difficulty: "intermediate",
        keywords: ["company research", "motivation", "culture fit", "goals alignment", "enthusiasm"],
        category: "Company Interest"
    },
    {
        question: "Describe a time when you faced a difficult challenge at work and how you overcame it.",
        testType: "hr",
        difficulty: "advanced",
        keywords: ["challenge", "problem-solving", "solution", "outcome", "learning", "teamwork"],
        category: "Problem Solving"
    },

    // Frontend Specific
    {
        question: "What is the difference between == and === in JavaScript?",
        testType: "frontend",
        difficulty: "beginner",
        keywords: ["equality", "type coercion", "strict equality", "comparison", "javascript"],
        category: "JavaScript Basics"
    },
    {
        question: "How do you optimize React application performance?",
        testType: "frontend",
        difficulty: "advanced",
        keywords: ["performance", "memoization", "lazy loading", "code splitting", "useMemo", "useCallback"],
        category: "React Optimization"
    },

    // Backend Specific
    {
        question: "What is middleware in Express.js?",
        testType: "backend",
        difficulty: "intermediate",
        keywords: ["middleware", "express", "request", "response", "next", "pipeline"],
        category: "Express.js"
    },
    {
        question: "Explain JWT authentication and its benefits.",
        testType: "backend",
        difficulty: "intermediate",
        keywords: ["JWT", "authentication", "token", "stateless", "security", "authorization"],
        category: "Authentication"
    },
    {
        question: "What is database indexing and why is it important?",
        testType: "backend",
        difficulty: "advanced",
        keywords: ["indexing", "database", "performance", "query optimization", "B-tree", "lookup"],
        category: "Database Optimization"
    }
];

// Function to upload questions
const uploadQuestions = async () => {
    try {
        await connectDB();
        
        // Clear existing questions (optional)
        console.log('Clearing existing questions...');
        await Question.deleteMany({});
        
        // Insert new questions
        console.log('Uploading your custom questions...');
        const uploadedQuestions = await Question.insertMany(customQuestions);
        
        console.log(`✅ Successfully uploaded ${uploadedQuestions.length} questions!`);
        console.log('\nQuestion Summary:');
        console.log(`Full Stack: ${uploadedQuestions.filter(q => q.testType === 'fullstack').length}`);
        console.log(`Frontend: ${uploadedQuestions.filter(q => q.testType === 'frontend').length}`);
        console.log(`Backend: ${uploadedQuestions.filter(q => q.testType === 'backend').length}`);
        console.log(`HR: ${uploadedQuestions.filter(q => q.testType === 'hr').length}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error uploading questions:', error);
        process.exit(1);
    }
};

// Run the upload
uploadQuestions();