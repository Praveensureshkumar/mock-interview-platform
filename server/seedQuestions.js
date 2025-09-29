const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

// Sample questions for the platform
const sampleQuestions = [
  // Full-Stack Questions
  {
    question: "Explain the difference between frontend and backend development. How do they work together?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["frontend", "backend", "client", "server", "api", "database"],
    category: "General"
  },
  {
    question: "What is RESTful API? Explain the main HTTP methods and when to use each.",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["rest", "api", "http", "get", "post", "put", "delete", "crud"],
    category: "API Design"
  },
  {
    question: "Design a scalable web application architecture for a social media platform. Discuss database design, caching, and load balancing.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["scalability", "architecture", "database", "caching", "load balancing", "microservices"],
    category: "System Design"
  },

  // Frontend Questions
  {
    question: "What is the difference between var, let, and const in JavaScript?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["var", "let", "const", "scope", "hoisting", "block scope"],
    category: "JavaScript"
  },
  {
    question: "Explain the concept of React Hooks. What are useState and useEffect used for?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["react", "hooks", "usestate", "useeffect", "functional components"],
    category: "React"
  },
  {
    question: "How would you optimize the performance of a React application? Discuss various techniques.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["performance", "optimization", "memo", "usememo", "lazy loading", "code splitting"],
    category: "Performance"
  },

  // Backend Questions
  {
    question: "What is Node.js and why is it popular for backend development?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["nodejs", "javascript", "event loop", "non-blocking", "server"],
    category: "Node.js"
  },
  {
    question: "Explain the concept of middleware in Express.js. Provide examples.",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["middleware", "express", "request", "response", "next", "authentication"],
    category: "Express.js"
  },
  {
    question: "Design a database schema for an e-commerce platform. Explain your choices for relationships and indexing.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["database", "schema", "relationships", "indexing", "normalization", "performance"],
    category: "Database Design"
  },

  // HR Questions
  {
    question: "Tell me about yourself and why you're interested in this position.",
    testType: "hr",
    difficulty: "beginner",
    keywords: ["background", "experience", "interest", "motivation", "skills"],
    category: "Introduction"
  },
  {
    question: "Describe a challenging project you worked on and how you overcame the difficulties.",
    testType: "hr",
    difficulty: "intermediate",
    keywords: ["challenge", "project", "problem solving", "teamwork", "solution"],
    category: "Experience"
  },
  {
    question: "Where do you see yourself in 5 years? How does this role align with your career goals?",
    testType: "hr",
    difficulty: "beginner",
    keywords: ["career goals", "future", "growth", "development", "alignment"],
    category: "Career Planning"
  },

  // Additional questions for variety
  {
    question: "What are the benefits of using TypeScript over JavaScript?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["typescript", "javascript", "type safety", "intellisense", "compilation"],
    category: "TypeScript"
  },
  {
    question: "Explain the concept of authentication vs authorization. How would you implement JWT?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["authentication", "authorization", "jwt", "token", "security"],
    category: "Security"
  },
  {
    question: "How do you handle state management in large React applications?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["state management", "redux", "context", "props drilling", "global state"],
    category: "State Management"
  },
  {
    question: "What is your greatest strength and how does it help you as a developer?",
    testType: "hr",
    difficulty: "beginner",
    keywords: ["strength", "skills", "development", "contribution", "team"],
    category: "Strengths"
  },
  {
    question: "How do you stay updated with the latest technology trends?",
    testType: "hr",
    difficulty: "beginner",
    keywords: ["learning", "technology", "trends", "resources", "continuous improvement"],
    category: "Learning"
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert sample questions
    await Question.insertMany(sampleQuestions);
    console.log(`Inserted ${sampleQuestions.length} sample questions`);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedQuestions();