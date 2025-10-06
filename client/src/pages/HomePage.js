import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiMonitor, FiServer, FiSun, FiMoon, FiDatabase } from 'react-icons/fi';
import { SiPython, SiJavascript, SiReact } from 'react-icons/si';
import { useTheme } from '../context/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedTest, setSelectedTest] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [mode, setMode] = useState('typed');

  const testTypes = [
    {
      id: 'fullstack',
      name: 'Full-Stack Developer',
      icon: FiCode,
      description: 'Complete web development: frontend, backend, databases, and system design',
      color: 'bg-purple-500'
    },
    {
      id: 'frontend',
      name: 'Frontend Developer',
      icon: FiMonitor,
      description: 'UI/UX, React, JavaScript, HTML/CSS, and responsive design',
      color: 'bg-blue-500'
    },
    {
      id: 'backend',
      name: 'Backend Developer',
      icon: FiServer,
      description: 'APIs, databases, server architecture, security, and scalability',
      color: 'bg-green-500'
    },
    {
      id: 'python',
      name: 'Python Developer',
      icon: SiPython,
      description: 'Python programming, Django/Flask, data structures, and algorithms',
      color: 'bg-yellow-500'
    },
    {
      id: 'javascript',
      name: 'JavaScript Developer',
      icon: SiJavascript,
      description: 'ES6+, async/await, DOM manipulation, and modern JavaScript concepts',
      color: 'bg-orange-500'
    },
    {
      id: 'sql',
      name: 'Database Developer',
      icon: FiDatabase,
      description: 'SQL/NoSQL databases, queries, optimization, and database design',
      color: 'bg-indigo-500'
    },
    {
      id: 'react',
      name: 'React Developer',
      icon: SiReact,
      description: 'React components, hooks, state management, and React ecosystem',
      color: 'bg-cyan-500'
    },
    {
      id: 'nodejs',
      name: 'Node.js Developer',
      icon: FiServer,
      description: 'Server-side JavaScript, Express.js, async programming, and NPM',
      color: 'bg-emerald-500'
    }
  ];

  const handleStartInterview = () => {
    if (!selectedTest) {
      alert('Please select a test type');
      return;
    }
    
    navigate(`/interview?testType=${selectedTest}&difficulty=${difficulty}&mode=${mode}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12 relative">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="absolute top-0 right-4 md:right-8 p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 dark:border-gray-600 group"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <FiSun className="h-6 w-6 text-yellow-500 group-hover:text-yellow-400 transition-colors duration-300" />
            ) : (
              <FiMoon className="h-6 w-6 text-blue-500 group-hover:text-blue-400 transition-colors duration-300" />
            )}
          </button>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered Mock Interview Platform
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Practice your interview skills with AI-generated questions. 
            Get instant feedback and track your progress over time.
          </p>
        </div>

        {/* Test Type Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Choose Your Interview Type
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testTypes.map((test) => {
              const IconComponent = test.icon;
              return (
                <div
                  key={test.id}
                  className={`relative p-6 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedTest === test.id
                      ? 'ring-4 ring-blue-500 bg-white dark:bg-gray-800 shadow-lg'
                      : 'bg-white dark:bg-gray-800 hover:shadow-md border border-gray-200 dark:border-gray-700'
                  }`}
                  onClick={() => setSelectedTest(test.id)}
                >
                  <div className={`inline-flex p-3 rounded-lg ${test.color} text-white mb-4`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {test.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {test.description}
                  </p>
                  {selectedTest === test.id && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Interview Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Difficulty Level */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            {/* Interview Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Interview Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="typed">Typed Only</option>
                <option value="voice">Voice Input</option>
              </select>
            </div>
          </div>
        </div>

        {/* Start Interview Button */}
        <div className="text-center">
          <button
            onClick={handleStartInterview}
            disabled={!selectedTest}
            className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 ${
              selectedTest
                ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            Start Mock Interview
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-300">
            💡 <strong>Tip:</strong> Login to save your interview results and track your progress over time.
            You can also take interviews as a guest, but results won't be saved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;