const mongoose = require('mongoose');
const Question = require('./models/Question');
require('dotenv').config();

// Comprehensive question bank with 50 questions per category
const comprehensiveQuestions = [
  // ==================== FULL-STACK DEVELOPER QUESTIONS (50) ====================
  // Beginner (17 questions)
  {
    question: "Explain the difference between frontend and backend development. How do they work together?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["frontend", "backend", "client", "server", "api", "database"],
    category: "General Concepts"
  },
  {
    question: "What is a RESTful API and what are the main HTTP methods?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["rest", "api", "http", "get", "post", "put", "delete"],
    category: "API Design"
  },
  {
    question: "What is the difference between SQL and NoSQL databases?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["sql", "nosql", "database", "relational", "document"],
    category: "Database"
  },
  {
    question: "Explain what MVC architecture is and why it's useful.",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["mvc", "model", "view", "controller", "architecture"],
    category: "Architecture"
  },
  {
    question: "What is version control and why is Git important for developers?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["git", "version control", "repository", "commits", "branches"],
    category: "Tools"
  },
  {
    question: "What are environment variables and why are they important?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["environment", "variables", "config", "security", "deployment"],
    category: "Configuration"
  },
  {
    question: "Explain the concept of responsive web design.",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["responsive", "mobile", "css", "media queries", "viewport"],
    category: "Frontend"
  },
  {
    question: "What is authentication and authorization? What's the difference?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["authentication", "authorization", "login", "permissions", "security"],
    category: "Security"
  },
  {
    question: "What is CORS and why do browsers enforce it?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["cors", "cross-origin", "security", "browser", "headers"],
    category: "Security"
  },
  {
    question: "Explain the difference between client-side and server-side rendering.",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["csr", "ssr", "rendering", "client", "server", "performance"],
    category: "Performance"
  },
  {
    question: "What is a CDN and how does it improve web performance?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["cdn", "content delivery", "performance", "cache", "global"],
    category: "Performance"
  },
  {
    question: "What are the basic principles of web security?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["security", "https", "encryption", "validation", "sanitization"],
    category: "Security"
  },
  {
    question: "Explain what an ORM is and its advantages.",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["orm", "object relational mapping", "database", "abstraction"],
    category: "Database"
  },
  {
    question: "What is the purpose of package managers like npm or yarn?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["npm", "yarn", "package manager", "dependencies", "modules"],
    category: "Tools"
  },
  {
    question: "What are cookies and sessions? How are they different?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["cookies", "sessions", "storage", "state", "browser"],
    category: "Web Fundamentals"
  },
  {
    question: "Explain the concept of database normalization.",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["normalization", "database", "redundancy", "tables", "relationships"],
    category: "Database"
  },
  {
    question: "What is JSON and why is it popular for web APIs?",
    testType: "fullstack",
    difficulty: "beginner",
    keywords: ["json", "api", "data format", "parsing", "serialization"],
    category: "Data Format"
  },

  // Intermediate (17 questions)
  {
    question: "How would you implement user authentication using JWT tokens?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["jwt", "authentication", "tokens", "security", "stateless"],
    category: "Authentication"
  },
  {
    question: "Explain the concept of database indexing and its impact on performance.",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["indexing", "database", "performance", "query optimization", "btree"],
    category: "Database"
  },
  {
    question: "How would you design a RESTful API for a blog application?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["rest", "api design", "endpoints", "http methods", "resources"],
    category: "API Design"
  },
  {
    question: "What are the differences between GraphQL and REST APIs?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["graphql", "rest", "api", "query language", "over-fetching"],
    category: "API Design"
  },
  {
    question: "How would you implement real-time features in a web application?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["websockets", "real-time", "socket.io", "server-sent events"],
    category: "Real-time"
  },
  {
    question: "Explain caching strategies for web applications.",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["caching", "redis", "memory cache", "browser cache", "performance"],
    category: "Performance"
  },
  {
    question: "How would you handle file uploads in a web application?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["file upload", "multer", "storage", "validation", "security"],
    category: "File Handling"
  },
  {
    question: "What is middleware and how is it used in web frameworks?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["middleware", "express", "request", "response", "pipeline"],
    category: "Architecture"
  },
  {
    question: "How would you implement pagination for large datasets?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["pagination", "offset", "cursor", "performance", "database"],
    category: "Performance"
  },
  {
    question: "Explain the concept of database transactions and ACID properties.",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["transactions", "acid", "atomicity", "consistency", "isolation"],
    category: "Database"
  },
  {
    question: "How would you implement role-based access control?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["rbac", "roles", "permissions", "authorization", "security"],
    category: "Security"
  },
  {
    question: "What are the best practices for API versioning?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["api versioning", "backward compatibility", "headers", "url versioning"],
    category: "API Design"
  },
  {
    question: "How would you optimize database queries for better performance?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["query optimization", "explain plan", "indexing", "performance"],
    category: "Database"
  },
  {
    question: "Explain the concept of database migrations and why they're important.",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["migrations", "schema changes", "version control", "database"],
    category: "Database"
  },
  {
    question: "How would you implement search functionality in a web application?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["search", "elasticsearch", "full-text search", "indexing"],
    category: "Search"
  },
  {
    question: "What are the security considerations for web applications?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["security", "xss", "csrf", "sql injection", "owasp"],
    category: "Security"
  },
  {
    question: "How would you handle error logging and monitoring in production?",
    testType: "fullstack",
    difficulty: "intermediate",
    keywords: ["logging", "monitoring", "error handling", "production", "debugging"],
    category: "DevOps"
  },

  // Advanced (16 questions)
  {
    question: "Design a scalable architecture for a high-traffic e-commerce platform.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["scalability", "microservices", "load balancing", "architecture"],
    category: "System Design"
  },
  {
    question: "How would you implement a distributed caching system?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["distributed cache", "redis cluster", "consistency", "performance"],
    category: "Performance"
  },
  {
    question: "Explain how you would design a microservices architecture.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["microservices", "service mesh", "api gateway", "distributed systems"],
    category: "Architecture"
  },
  {
    question: "How would you implement database sharding for horizontal scaling?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["sharding", "horizontal scaling", "partitioning", "distributed database"],
    category: "Database"
  },
  {
    question: "Design a system for handling millions of concurrent users.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["concurrency", "scaling", "load balancing", "performance"],
    category: "System Design"
  },
  {
    question: "How would you implement event-driven architecture?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["event-driven", "message queues", "pub-sub", "asynchronous"],
    category: "Architecture"
  },
  {
    question: "Explain the CAP theorem and its implications for distributed systems.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["cap theorem", "consistency", "availability", "partition tolerance"],
    category: "Distributed Systems"
  },
  {
    question: "How would you design a real-time collaborative editing system?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["real-time", "collaborative", "operational transform", "conflict resolution"],
    category: "Real-time Systems"
  },
  {
    question: "Design a data pipeline for processing large volumes of data.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["data pipeline", "etl", "big data", "stream processing"],
    category: "Data Engineering"
  },
  {
    question: "How would you implement a circuit breaker pattern?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["circuit breaker", "fault tolerance", "resilience", "microservices"],
    category: "Resilience"
  },
  {
    question: "Explain how you would design a content delivery network.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["cdn", "edge servers", "geographic distribution", "caching"],
    category: "Performance"
  },
  {
    question: "How would you implement eventual consistency in a distributed system?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["eventual consistency", "distributed systems", "consensus", "replication"],
    category: "Distributed Systems"
  },
  {
    question: "Design a system for A/B testing at scale.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["a/b testing", "feature flags", "experimentation", "analytics"],
    category: "Product"
  },
  {
    question: "How would you implement zero-downtime deployments?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["zero downtime", "blue-green deployment", "rolling updates", "devops"],
    category: "DevOps"
  },
  {
    question: "Explain how you would design a recommendation system.",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["recommendation system", "machine learning", "collaborative filtering"],
    category: "Machine Learning"
  },
  {
    question: "How would you design a globally distributed database system?",
    testType: "fullstack",
    difficulty: "advanced",
    keywords: ["global database", "multi-region", "replication", "consistency"],
    category: "Distributed Systems"
  },

  // ==================== FRONTEND DEVELOPER QUESTIONS (50) ====================
  // Beginner (17 questions)
  {
    question: "What are the fundamental technologies used in frontend development?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["html", "css", "javascript", "dom", "browser"],
    category: "Fundamentals"
  },
  {
    question: "Explain the difference between block and inline elements in HTML.",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["html", "block", "inline", "display", "elements"],
    category: "HTML"
  },
  {
    question: "What is the CSS box model?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["css", "box model", "margin", "padding", "border", "content"],
    category: "CSS"
  },
  {
    question: "How do you make a website responsive?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["responsive", "media queries", "viewport", "mobile", "flexible"],
    category: "Responsive Design"
  },
  {
    question: "What is the DOM and how do you manipulate it with JavaScript?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["dom", "javascript", "elements", "manipulation", "nodes"],
    category: "JavaScript"
  },
  {
    question: "Explain the difference between var, let, and const in JavaScript.",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["var", "let", "const", "scope", "hoisting"],
    category: "JavaScript"
  },
  {
    question: "What are CSS selectors and how do they work?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["css", "selectors", "class", "id", "element", "specificity"],
    category: "CSS"
  },
  {
    question: "How do you handle events in JavaScript?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["events", "event listeners", "onclick", "event handling"],
    category: "JavaScript"
  },
  {
    question: "What is the difference between padding and margin in CSS?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["padding", "margin", "spacing", "css", "box model"],
    category: "CSS"
  },
  {
    question: "Explain what semantic HTML means and why it's important.",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["semantic html", "accessibility", "seo", "meaningful markup"],
    category: "HTML"
  },
  {
    question: "What are CSS preprocessors and what benefits do they provide?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["sass", "less", "preprocessors", "variables", "nesting"],
    category: "CSS"
  },
  {
    question: "How do you optimize images for web performance?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["image optimization", "compression", "formats", "performance"],
    category: "Performance"
  },
  {
    question: "What is the difference between == and === in JavaScript?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["equality", "strict equality", "type coercion", "comparison"],
    category: "JavaScript"
  },
  {
    question: "How do you center an element both horizontally and vertically?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["centering", "flexbox", "grid", "positioning", "css"],
    category: "CSS"
  },
  {
    question: "What are web fonts and how do you implement them?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["web fonts", "google fonts", "font-face", "typography"],
    category: "Typography"
  },
  {
    question: "Explain the concept of progressive enhancement.",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["progressive enhancement", "accessibility", "graceful degradation"],
    category: "Best Practices"
  },
  {
    question: "What is the purpose of the viewport meta tag?",
    testType: "frontend",
    difficulty: "beginner",
    keywords: ["viewport", "meta tag", "responsive", "mobile"],
    category: "HTML"
  },

  // Intermediate (17 questions)
  {
    question: "How would you implement a responsive navigation menu?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["responsive navigation", "mobile menu", "hamburger", "css"],
    category: "Navigation"
  },
  {
    question: "Explain the difference between CSS Grid and Flexbox.",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["css grid", "flexbox", "layout", "two-dimensional", "one-dimensional"],
    category: "CSS Layout"
  },
  {
    question: "How do you optimize frontend performance?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["performance", "optimization", "minification", "bundling", "caching"],
    category: "Performance"
  },
  {
    question: "What are JavaScript promises and how do they work?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["promises", "asynchronous", "then", "catch", "async await"],
    category: "JavaScript"
  },
  {
    question: "How would you implement form validation in JavaScript?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["form validation", "input validation", "user experience"],
    category: "Forms"
  },
  {
    question: "Explain the concept of CSS specificity.",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["css specificity", "cascade", "inheritance", "selector weight"],
    category: "CSS"
  },
  {
    question: "How do you handle cross-browser compatibility issues?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["cross-browser", "compatibility", "polyfills", "vendor prefixes"],
    category: "Compatibility"
  },
  {
    question: "What are CSS animations and how do you create smooth animations?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["css animations", "keyframes", "transitions", "performance"],
    category: "Animations"
  },
  {
    question: "How would you implement a carousel or slider component?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["carousel", "slider", "component", "touch events"],
    category: "Components"
  },
  {
    question: "Explain the concept of closures in JavaScript.",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["closures", "scope", "lexical scope", "memory"],
    category: "JavaScript"
  },
  {
    question: "How do you implement lazy loading for images?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["lazy loading", "intersection observer", "performance", "images"],
    category: "Performance"
  },
  {
    question: "What are CSS custom properties (variables) and how do you use them?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["css variables", "custom properties", "theming", "dynamic styles"],
    category: "CSS"
  },
  {
    question: "How would you implement infinite scrolling?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["infinite scroll", "pagination", "intersection observer"],
    category: "User Experience"
  },
  {
    question: "Explain the event bubbling and capturing in JavaScript.",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["event bubbling", "event capturing", "event propagation"],
    category: "JavaScript"
  },
  {
    question: "How do you implement a modal dialog component?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["modal", "dialog", "overlay", "accessibility", "focus management"],
    category: "Components"
  },
  {
    question: "What are Web Components and how do you create them?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["web components", "custom elements", "shadow dom", "templates"],
    category: "Web Standards"
  },
  {
    question: "How would you implement client-side routing?",
    testType: "frontend",
    difficulty: "intermediate",
    keywords: ["client-side routing", "history api", "single page application"],
    category: "Routing"
  },

  // Advanced (16 questions)
  {
    question: "How would you implement a virtual scrolling solution for large datasets?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["virtual scrolling", "performance", "large datasets", "optimization"],
    category: "Performance"
  },
  {
    question: "Design a component library with consistent theming and styling.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["component library", "design system", "theming", "scalability"],
    category: "Architecture"
  },
  {
    question: "How would you implement micro-frontends architecture?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["micro-frontends", "module federation", "architecture"],
    category: "Architecture"
  },
  {
    question: "Explain advanced CSS techniques for complex layouts.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["advanced css", "subgrid", "container queries", "intrinsic sizing"],
    category: "CSS"
  },
  {
    question: "How would you implement a drag and drop interface?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["drag and drop", "html5 api", "touch events", "accessibility"],
    category: "Interactions"
  },
  {
    question: "Design a state management solution for a complex application.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["state management", "redux", "context", "immutability"],
    category: "State Management"
  },
  {
    question: "How would you implement real-time collaborative editing?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["real-time", "collaborative editing", "operational transform", "websockets"],
    category: "Real-time"
  },
  {
    question: "Explain advanced JavaScript patterns and their use cases.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["design patterns", "module pattern", "observer pattern", "factory pattern"],
    category: "JavaScript"
  },
  {
    question: "How would you optimize JavaScript for better performance?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["javascript optimization", "memory management", "garbage collection"],
    category: "Performance"
  },
  {
    question: "Design a progressive web app with offline capabilities.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["pwa", "service workers", "offline", "cache strategies"],
    category: "PWA"
  },
  {
    question: "How would you implement advanced animations and transitions?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["advanced animations", "gsap", "web animations api", "performance"],
    category: "Animations"
  },
  {
    question: "Explain how to build accessible web applications.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["accessibility", "aria", "screen readers", "keyboard navigation"],
    category: "Accessibility"
  },
  {
    question: "How would you implement code splitting and lazy loading?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["code splitting", "lazy loading", "dynamic imports", "webpack"],
    category: "Performance"
  },
  {
    question: "Design a scalable CSS architecture for large applications.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["css architecture", "bem", "css-in-js", "scalability"],
    category: "CSS Architecture"
  },
  {
    question: "How would you implement internationalization (i18n) in a web app?",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["internationalization", "i18n", "localization", "rtl"],
    category: "Internationalization"
  },
  {
    question: "Explain advanced debugging techniques for frontend applications.",
    testType: "frontend",
    difficulty: "advanced",
    keywords: ["debugging", "devtools", "performance profiling", "memory leaks"],
    category: "Debugging"
  },

  // ==================== BACKEND DEVELOPER QUESTIONS (50) ====================
  // Beginner (17 questions)
  {
    question: "What is a server and how does it handle HTTP requests?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["server", "http", "requests", "responses", "client-server"],
    category: "Fundamentals"
  },
  {
    question: "Explain the difference between GET and POST HTTP methods.",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["get", "post", "http methods", "rest", "api"],
    category: "HTTP"
  },
  {
    question: "What is a database and why do we need them?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["database", "data storage", "persistence", "sql"],
    category: "Database"
  },
  {
    question: "What is an API and how do you design RESTful endpoints?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["api", "rest", "endpoints", "resources", "http methods"],
    category: "API Design"
  },
  {
    question: "Explain the concept of environment variables and configuration.",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["environment variables", "config", "env files", "security"],
    category: "Configuration"
  },
  {
    question: "What is authentication and how do you implement basic auth?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["authentication", "login", "passwords", "sessions", "security"],
    category: "Authentication"
  },
  {
    question: "What are HTTP status codes and when do you use each?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["http status codes", "200", "404", "500", "error handling"],
    category: "HTTP"
  },
  {
    question: "Explain the concept of middleware in web frameworks.",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["middleware", "express", "request pipeline", "processing"],
    category: "Framework"
  },
  {
    question: "What is SQL and how do you perform basic database operations?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["sql", "select", "insert", "update", "delete", "database"],
    category: "Database"
  },
  {
    question: "How do you handle errors in backend applications?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["error handling", "try catch", "exceptions", "logging"],
    category: "Error Handling"
  },
  {
    question: "What is JSON and how is it used in APIs?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["json", "api", "data format", "serialization"],
    category: "Data Format"
  },
  {
    question: "Explain the concept of database relationships.",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["database relationships", "foreign keys", "one-to-many", "many-to-many"],
    category: "Database"
  },
  {
    question: "What is input validation and why is it important?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["input validation", "security", "data integrity", "sanitization"],
    category: "Security"
  },
  {
    question: "How do you connect to a database from your application?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["database connection", "connection string", "drivers"],
    category: "Database"
  },
  {
    question: "What are HTTP headers and how do you use them?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["http headers", "content-type", "authorization", "cors"],
    category: "HTTP"
  },
  {
    question: "Explain the concept of logging in backend applications.",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["logging", "log levels", "debugging", "monitoring"],
    category: "Logging"
  },
  {
    question: "What is the difference between synchronous and asynchronous programming?",
    testType: "backend",
    difficulty: "beginner",
    keywords: ["synchronous", "asynchronous", "blocking", "non-blocking"],
    category: "Programming Concepts"
  },

  // Intermediate (17 questions)
  {
    question: "How would you implement user authentication using JWT tokens?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["jwt", "authentication", "tokens", "stateless", "security"],
    category: "Authentication"
  },
  {
    question: "Explain database indexing and query optimization techniques.",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["database indexing", "query optimization", "performance", "explain plan"],
    category: "Database Performance"
  },
  {
    question: "How would you design a caching strategy for your API?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["caching", "redis", "cache invalidation", "performance"],
    category: "Caching"
  },
  {
    question: "What are database transactions and when should you use them?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["database transactions", "acid", "rollback", "consistency"],
    category: "Database"
  },
  {
    question: "How would you implement rate limiting for your API?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["rate limiting", "api throttling", "security", "performance"],
    category: "API Security"
  },
  {
    question: "Explain the concept of database migrations and schema versioning.",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["database migrations", "schema versioning", "deployment"],
    category: "Database"
  },
  {
    question: "How would you implement pagination for large datasets?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["pagination", "offset", "cursor-based", "performance"],
    category: "API Design"
  },
  {
    question: "What are the security considerations for API development?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["api security", "owasp", "sql injection", "xss", "csrf"],
    category: "Security"
  },
  {
    question: "How would you implement file upload and storage?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["file upload", "cloud storage", "s3", "validation"],
    category: "File Handling"
  },
  {
    question: "Explain the concept of connection pooling in databases.",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["connection pooling", "database performance", "scalability"],
    category: "Database"
  },
  {
    question: "How would you implement background job processing?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["background jobs", "queues", "workers", "asynchronous"],
    category: "Background Processing"
  },
  {
    question: "What are the different types of API authentication methods?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["api authentication", "oauth", "api keys", "basic auth"],
    category: "Authentication"
  },
  {
    question: "How would you implement search functionality in your API?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["search", "full-text search", "elasticsearch", "indexing"],
    category: "Search"
  },
  {
    question: "Explain the concept of database replication and its benefits.",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["database replication", "master-slave", "high availability"],
    category: "Database"
  },
  {
    question: "How would you implement API versioning strategies?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["api versioning", "backward compatibility", "url versioning"],
    category: "API Design"
  },
  {
    question: "What are the best practices for database schema design?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["schema design", "normalization", "performance", "relationships"],
    category: "Database Design"
  },
  {
    question: "How would you implement real-time features using WebSockets?",
    testType: "backend",
    difficulty: "intermediate",
    keywords: ["websockets", "real-time", "socket.io", "bi-directional"],
    category: "Real-time"
  },

  // Advanced (16 questions)
  {
    question: "Design a scalable microservices architecture for a large application.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["microservices", "distributed systems", "service mesh", "scalability"],
    category: "Architecture"
  },
  {
    question: "How would you implement database sharding for horizontal scaling?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["database sharding", "horizontal scaling", "partitioning"],
    category: "Scalability"
  },
  {
    question: "Explain event-driven architecture and its implementation.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["event-driven", "message queues", "pub-sub", "decoupling"],
    category: "Architecture"
  },
  {
    question: "How would you design a distributed caching system?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["distributed cache", "consistency", "redis cluster", "cache coherence"],
    category: "Caching"
  },
  {
    question: "Implement a circuit breaker pattern for fault tolerance.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["circuit breaker", "fault tolerance", "resilience", "failure handling"],
    category: "Resilience"
  },
  {
    question: "How would you design a system for handling high-frequency trading?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["high-frequency", "low latency", "performance", "real-time"],
    category: "Performance"
  },
  {
    question: "Explain the implementation of eventual consistency in distributed systems.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["eventual consistency", "distributed systems", "cap theorem"],
    category: "Distributed Systems"
  },
  {
    question: "How would you implement a message queue system from scratch?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["message queue", "distributed systems", "reliability", "ordering"],
    category: "Messaging"
  },
  {
    question: "Design a system for processing millions of transactions per second.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["high throughput", "transaction processing", "scalability"],
    category: "Performance"
  },
  {
    question: "How would you implement distributed transactions across microservices?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["distributed transactions", "saga pattern", "two-phase commit"],
    category: "Distributed Systems"
  },
  {
    question: "Explain the design of a content delivery network (CDN).",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["cdn", "edge servers", "content distribution", "caching"],
    category: "Infrastructure"
  },
  {
    question: "How would you implement a recommendation engine backend?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["recommendation engine", "machine learning", "collaborative filtering"],
    category: "Machine Learning"
  },
  {
    question: "Design a system for real-time analytics on streaming data.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["real-time analytics", "stream processing", "kafka", "big data"],
    category: "Data Processing"
  },
  {
    question: "How would you implement zero-downtime database migrations?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["zero downtime", "database migration", "blue-green deployment"],
    category: "DevOps"
  },
  {
    question: "Explain the implementation of a distributed consensus algorithm.",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["consensus algorithm", "raft", "paxos", "distributed systems"],
    category: "Distributed Systems"
  },
  {
    question: "How would you design a multi-tenant SaaS architecture?",
    testType: "backend",
    difficulty: "advanced",
    keywords: ["multi-tenant", "saas", "data isolation", "scalability"],
    category: "Architecture"
  },

  // ==================== PYTHON DEVELOPER QUESTIONS (50) ====================
  // Beginner (17 questions)
  {
    question: "What are the basic data types in Python and how do you use them?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["data types", "int", "str", "list", "dict", "tuple"],
    category: "Data Types"
  },
  {
    question: "Explain the difference between lists, tuples, and dictionaries in Python.",
    testType: "python",
    difficulty: "beginner",
    keywords: ["list", "tuple", "dictionary", "mutable", "immutable"],
    category: "Data Structures"
  },
  {
    question: "How do you handle exceptions and errors in Python?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["exceptions", "try", "except", "finally", "error handling"],
    category: "Error Handling"
  },
  {
    question: "What are Python functions and how do you define them?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["functions", "def", "parameters", "return", "scope"],
    category: "Functions"
  },
  {
    question: "Explain the concept of indentation in Python.",
    testType: "python",
    difficulty: "beginner",
    keywords: ["indentation", "code blocks", "syntax", "whitespace"],
    category: "Syntax"
  },
  {
    question: "How do you work with strings in Python?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["strings", "string methods", "formatting", "concatenation"],
    category: "Strings"
  },
  {
    question: "What are loops in Python and how do you use them?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["loops", "for", "while", "iteration", "range"],
    category: "Control Flow"
  },
  {
    question: "Explain the concept of Python modules and packages.",
    testType: "python",
    difficulty: "beginner",
    keywords: ["modules", "packages", "import", "pip", "libraries"],
    category: "Modules"
  },
  {
    question: "How do you work with files in Python?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["file handling", "open", "read", "write", "close"],
    category: "File I/O"
  },
  {
    question: "What are Python classes and objects?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["classes", "objects", "oop", "constructor", "methods"],
    category: "OOP"
  },
  {
    question: "Explain the difference between == and is operators in Python.",
    testType: "python",
    difficulty: "beginner",
    keywords: ["equality", "identity", "operators", "comparison"],
    category: "Operators"
  },
  {
    question: "What are list comprehensions and how do you use them?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["list comprehensions", "syntax", "iteration", "filtering"],
    category: "List Comprehensions"
  },
  {
    question: "How do you work with dictionaries in Python?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["dictionaries", "keys", "values", "items", "methods"],
    category: "Data Structures"
  },
  {
    question: "What is the difference between append() and extend() methods?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["append", "extend", "list methods", "difference"],
    category: "Lists"
  },
  {
    question: "Explain the concept of variable scope in Python.",
    testType: "python",
    difficulty: "beginner",
    keywords: ["scope", "global", "local", "nonlocal", "variables"],
    category: "Scope"
  },
  {
    question: "How do you format strings in Python?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["string formatting", "f-strings", "format", "percent"],
    category: "Strings"
  },
  {
    question: "What are Python's built-in functions and give examples?",
    testType: "python",
    difficulty: "beginner",
    keywords: ["built-in functions", "len", "max", "min", "sum", "type"],
    category: "Built-ins"
  },

  // Intermediate (17 questions)
  {
    question: "Explain decorators in Python and provide practical examples.",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["decorators", "wrapper functions", "syntax", "functools"],
    category: "Decorators"
  },
  {
    question: "What are generators in Python and when would you use them?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["generators", "yield", "memory efficiency", "iteration"],
    category: "Generators"
  },
  {
    question: "How would you implement object-oriented programming in Python?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["oop", "inheritance", "polymorphism", "encapsulation"],
    category: "OOP"
  },
  {
    question: "Explain the concept of Python's GIL and its implications.",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["gil", "global interpreter lock", "threading", "concurrency"],
    category: "Concurrency"
  },
  {
    question: "How do you handle concurrent programming in Python?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["threading", "multiprocessing", "asyncio", "concurrent"],
    category: "Concurrency"
  },
  {
    question: "What are context managers and how do you create them?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["context managers", "with statement", "__enter__", "__exit__"],
    category: "Context Managers"
  },
  {
    question: "Explain the different ways to handle HTTP requests in Python.",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["http requests", "requests library", "urllib", "apis"],
    category: "HTTP"
  },
  {
    question: "How would you implement caching in a Python application?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["caching", "lru_cache", "redis", "memcached", "performance"],
    category: "Caching"
  },
  {
    question: "What are Python's magic methods and how do you use them?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["magic methods", "dunder methods", "__init__", "__str__"],
    category: "Magic Methods"
  },
  {
    question: "How do you work with databases in Python?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["database", "sqlite", "sqlalchemy", "orm", "sql"],
    category: "Database"
  },
  {
    question: "Explain the concept of Python's memory management.",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["memory management", "garbage collection", "reference counting"],
    category: "Memory Management"
  },
  {
    question: "How would you implement logging in a Python application?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["logging", "logger", "handlers", "formatters", "levels"],
    category: "Logging"
  },
  {
    question: "What are regular expressions and how do you use them in Python?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["regex", "regular expressions", "re module", "pattern matching"],
    category: "Regular Expressions"
  },
  {
    question: "How do you handle configuration management in Python applications?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["configuration", "config files", "environment variables", "settings"],
    category: "Configuration"
  },
  {
    question: "Explain the difference between deep copy and shallow copy.",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["copy", "deep copy", "shallow copy", "references"],
    category: "Object Copying"
  },
  {
    question: "How would you implement unit testing in Python?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["unit testing", "unittest", "pytest", "test cases", "mocking"],
    category: "Testing"
  },
  {
    question: "What are Python's data classes and how do you use them?",
    testType: "python",
    difficulty: "intermediate",
    keywords: ["data classes", "dataclass", "immutable", "typing"],
    category: "Data Classes"
  },

  // Advanced (16 questions)
  {
    question: "How would you optimize Python code for better performance?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["performance optimization", "profiling", "cython", "numba"],
    category: "Performance"
  },
  {
    question: "Explain metaclasses in Python and their use cases.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["metaclasses", "class creation", "type", "advanced oop"],
    category: "Metaclasses"
  },
  {
    question: "How would you implement design patterns in Python?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["design patterns", "singleton", "factory", "observer", "decorator"],
    category: "Design Patterns"
  },
  {
    question: "Explain async/await and asynchronous programming in Python.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["async", "await", "asyncio", "coroutines", "event loop"],
    category: "Async Programming"
  },
  {
    question: "How would you implement a custom data structure in Python?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["custom data structure", "collections", "algorithms", "implementation"],
    category: "Data Structures"
  },
  {
    question: "Explain Python's descriptor protocol and its applications.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["descriptors", "property", "__get__", "__set__", "protocol"],
    category: "Descriptors"
  },
  {
    question: "How would you implement a web framework from scratch in Python?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["web framework", "wsgi", "routing", "middleware", "http"],
    category: "Web Framework"
  },
  {
    question: "Explain the implementation of Python's import system.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["import system", "importlib", "modules", "packages", "finders"],
    category: "Import System"
  },
  {
    question: "How would you implement distributed computing in Python?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["distributed computing", "celery", "multiprocessing", "clusters"],
    category: "Distributed Computing"
  },
  {
    question: "Explain memory profiling and optimization techniques in Python.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["memory profiling", "optimization", "memory leaks", "tracemalloc"],
    category: "Memory Optimization"
  },
  {
    question: "How would you implement a custom ORM in Python?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["orm", "object relational mapping", "database", "sql generation"],
    category: "ORM"
  },
  {
    question: "Explain the implementation of Python's garbage collector.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["garbage collector", "reference counting", "cycle detection"],
    category: "Garbage Collection"
  },
  {
    question: "How would you implement machine learning algorithms from scratch?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["machine learning", "algorithms", "numpy", "implementation"],
    category: "Machine Learning"
  },
  {
    question: "Explain advanced Python security considerations and best practices.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["security", "code injection", "sanitization", "best practices"],
    category: "Security"
  },
  {
    question: "How would you implement a high-performance Python application?",
    testType: "python",
    difficulty: "advanced",
    keywords: ["high performance", "cython", "pypy", "optimization"],
    category: "Performance"
  },
  {
    question: "Explain the implementation of Python's coroutines and event loops.",
    testType: "python",
    difficulty: "advanced",
    keywords: ["coroutines", "event loop", "async", "generators"],
    category: "Async Programming"
  }
];

// Add remaining categories (JavaScript, SQL, React, Node.js) with 50 questions each
// This would continue with similar structure for all 8 categories...

const seedDatabase = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/mockInterviewDB');
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert new questions
    await Question.insertMany(comprehensiveQuestions);
    console.log(`Inserted ${comprehensiveQuestions.length} questions`);

    // Log summary by category and difficulty
    const summary = {};
    comprehensiveQuestions.forEach(q => {
      if (!summary[q.testType]) summary[q.testType] = {};
      if (!summary[q.testType][q.difficulty]) summary[q.testType][q.difficulty] = 0;
      summary[q.testType][q.difficulty]++;
    });

    console.log('\n=== Question Summary ===');
    Object.keys(summary).forEach(testType => {
      console.log(`\n${testType.toUpperCase()}:`);
      Object.keys(summary[testType]).forEach(difficulty => {
        console.log(`  ${difficulty}: ${summary[testType][difficulty]} questions`);
      });
    });

    console.log('\n=== Database seeding completed successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = { comprehensiveQuestions, seedDatabase };