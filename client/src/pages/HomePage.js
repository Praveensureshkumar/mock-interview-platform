import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiMonitor, FiServer, FiUsers } from 'react-icons/fi';

const HomePage = () => {
  const navigate = useNavigate();
  const [selectedTest, setSelectedTest] = useState('');
  const [difficulty, setDifficulty] = useState('beginner');
  const [mode, setMode] = useState('typed');

  const testTypes = [
    {
      id: 'fullstack',
      name: 'Full-Stack',
      icon: FiCode,
      description: 'Complete web development questions covering frontend, backend, and database concepts',
      color: 'bg-purple-500'
    },
    {
      id: 'frontend',
      name: 'Front-End',
      icon: FiMonitor,
      description: 'HTML, CSS, JavaScript, React, and UI/UX development questions',
      color: 'bg-blue-500'
    },
    {
      id: 'backend',
      name: 'Back-End',
      icon: FiServer,
      description: 'Server-side development, databases, APIs, and system architecture',
      color: 'bg-green-500'
    },
    {
      id: 'hr',
      name: 'HR',
      icon: FiUsers,
      description: 'Behavioral questions, soft skills, and general interview preparation',
      color: 'bg-orange-500'
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
        <div className="text-center mb-12">
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