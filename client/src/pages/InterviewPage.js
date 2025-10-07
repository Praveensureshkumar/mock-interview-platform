import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../utils/api';
import VoiceInput from '../components/VoiceInput';
import { FiSend, FiArrowLeft } from 'react-icons/fi';

const InterviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const messagesEndRef = useRef(null);

  // Parse URL parameters
  const urlParams = new URLSearchParams(location.search);
  const testType = urlParams.get('testType');
  const difficulty = urlParams.get('difficulty');
  const mode = urlParams.get('mode');

  // Redirect if essential parameters are missing
  useEffect(() => {
    if (!testType || !difficulty) {
      console.error('Missing required parameters: testType or difficulty');
      navigate('/');
      return;
    }
  }, [testType, difficulty, navigate]);

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      event.preventDefault();
      navigate('/', { replace: true });
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  useEffect(() => {
    if (testType && difficulty) {
      loadQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testType, difficulty]);

  useEffect(() => {
    scrollToBottom();
  }, [answers, currentQuestionIndex]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadQuestions = async () => {
    try {
      setLoading(true);
      console.log(`🤖 Requesting AI questions for ${testType} - ${difficulty}`);
      
      const response = await interviewAPI.getQuestions(testType, difficulty);
      const questionsData = response.data.questions;
      const metadata = response.data.metadata;
      
      console.log('📊 Questions received:', questionsData);
      
      // Verify all questions are AI-generated
      const allAIGenerated = questionsData.every(q => q.aiGenerated === true);
      console.log(`🤖 All questions AI-generated: ${allAIGenerated}`);
      
      if (metadata) {
        console.log(`✅ Generation confirmed: ${metadata.allAIGenerated}`);
      }
      
      setQuestions(questionsData);
    } catch (error) {
      console.error('Failed to load questions:', error);
      alert('Failed to load AI questions. Please try again.');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (!currentAnswer.trim()) {
      return;
    }

    const newAnswer = {
      questionId: questions[currentQuestionIndex]._id,
      question: questions[currentQuestionIndex].question,
      answer: currentAnswer,
      timestamp: new Date()
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);
    setCurrentAnswer('');

    // Move to next question or complete interview
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeInterview(updatedAnswers);
    }
  };

  const completeInterview = async (finalAnswers) => {
    setIsCompleted(true);
    
    // Calculate score
    const score = calculateScore(finalAnswers);
    
    const interviewResult = {
      testType,
      difficulty,
      mode,
      questions: questions.map(q => q._id),
      answers: finalAnswers,
      score,
      completedAt: new Date()
    };

    // Save results if user is logged in
    if (user) {
      try {
        await interviewAPI.saveResult(interviewResult);
        // Trigger profile refresh by setting a flag in localStorage
        localStorage.setItem('interviewCompleted', Date.now().toString());
        console.log('Interview results saved successfully');
      } catch (error) {
        console.error('Failed to save results:', error);
      }
    }

    setResults({
      score,
      totalQuestions: questions.length,
      strengths: getStrengths(finalAnswers),
      weaknesses: getWeaknesses(finalAnswers),
      answers: finalAnswers
    });
    setShowResults(true);
  };

  const calculateScore = (answers) => {
    let totalScore = 0;
    
    answers.forEach((answer, index) => {
      const question = questions[index];
      if (question && question.keywords) {
        const keywords = question.keywords.map(k => k.toLowerCase());
        const answerText = answer.answer.toLowerCase();
        
        let matchCount = 0;
        keywords.forEach(keyword => {
          if (answerText.includes(keyword)) {
            matchCount++;
          }
        });
        
        // Partial credit based on keyword matches
        const questionScore = (matchCount / keywords.length) * 100;
        totalScore += questionScore;
      }
    });
    
    return Math.round(totalScore / answers.length);
  };

  const getStrengths = (answers) => {
    const strengths = [];
    answers.forEach((answer, index) => {
      if (answer.answer.length > 100) {
        strengths.push('Detailed responses');
      }
    });
    
    if (strengths.length === 0) {
      strengths.push('Completed the interview');
    }
    
    return [...new Set(strengths)];
  };

  const getWeaknesses = (answers) => {
    const weaknesses = [];
    answers.forEach((answer, index) => {
      if (answer.answer.length < 50) {
        weaknesses.push('Consider providing more detailed answers');
      }
    });
    
    if (weaknesses.length === 0) {
      weaknesses.push('Keep practicing to improve further');
    }
    
    return [...new Set(weaknesses)];
  };

  const handleVoiceTranscript = (transcript) => {
    console.log('🎯 InterviewPage received voice transcript:', transcript);
    // Clean up the transcript and add it to current answer
    const cleanedTranscript = transcript.trim();
    if (cleanedTranscript) {
      console.log('🎤 Voice transcript received:', cleanedTranscript);
      setCurrentAnswer(prev => {
        const prevTrimmed = prev.trim();
        // If previous answer is empty, just set the new transcript
        // Otherwise, add a space and then the new transcript
        const newAnswer = prevTrimmed ? `${prevTrimmed} ${cleanedTranscript}` : cleanedTranscript;
        console.log('📝 Updated answer from:', prev, 'to:', newAnswer);
        return newAnswer;
      });
    } else {
      console.log('⚠️ Empty transcript received, ignoring');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">Loading interview questions...</p>
        </div>
      </div>
    );
  }

  // Don't render if essential parameters are missing
  if (!testType || !difficulty) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <FiArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              {testType ? testType.charAt(0).toUpperCase() + testType.slice(1) : 'Unknown'} Interview
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : 'Unknown'} • {mode === 'voice' ? 'Voice Input' : 'Text Input'}
            </p>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Question {Math.min(currentQuestionIndex + 1, questions.length)} of {questions.length}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md min-h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {/* Display all previous Q&A pairs */}
            {answers.map((answer, index) => (
              <div key={index} className="space-y-4">
                {/* Question */}
                <div className="flex justify-start">
                  <div className="max-w-3xl bg-blue-100 dark:bg-blue-900 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">AI</span>
                      </div>
                      <span className="font-medium text-blue-900 dark:text-blue-200">AI Interviewer</span>
                      {/* AI Generated Badge */}
                      <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium">
                        🤖 AI Generated
                      </span>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{answer.question}</p>
                  </div>
                </div>

                {/* Answer */}
                <div className="flex justify-end">
                  <div className="max-w-3xl bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-200">You</span>
                      <div className="w-8 h-8 bg-gray-600 dark:bg-gray-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user && user.name ? user.name.charAt(0).toUpperCase() : 'G'}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{answer.answer}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Current Question */}
            {!isCompleted && questions[currentQuestionIndex] && (
              <div className="flex justify-start">
                <div className="max-w-3xl bg-blue-100 dark:bg-blue-900 rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">AI</span>
                    </div>
                    <span className="font-medium text-blue-900 dark:text-blue-200">AI Interviewer</span>
                    {/* AI Generated Badge */}
                    <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full font-medium">
                      🤖 AI Generated
                    </span>
                  </div>
                  <p className="text-gray-800 dark:text-gray-200">{questions[currentQuestionIndex].question}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          {!isCompleted && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              {mode === 'voice' && (
                <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-center mb-3">
                    <div className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded-full">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Voice Mode Active</span>
                    </div>
                  </div>
                  <VoiceInput 
                    onTranscript={handleVoiceTranscript}
                    disabled={isCompleted}
                    shouldReadQuestion={mode === 'voice' && !isCompleted}
                    questionText={questions[currentQuestionIndex]?.question}
                  />
                </div>
              )}
              
              <div className="flex space-x-3">
                <textarea
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  placeholder={mode === 'voice' ? 'Your voice input will appear here, or type manually...' : 'Type your answer here...'}
                  className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none transition-colors ${
                    mode === 'voice' 
                      ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100' 
                      : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  } placeholder-gray-500 dark:placeholder-gray-400`}
                  rows="4"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitAnswer();
                    }
                  }}
                />
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!currentAnswer.trim()}
                  className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center transition-colors"
                  title="Submit Answer"
                >
                  <FiSend className="h-5 w-5" />
                </button>
              </div>
              
              <div className="mt-2 flex justify-between items-center">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {mode === 'voice' 
                    ? 'Use voice input above or type manually. Press Enter to submit, Shift+Enter for new line' 
                    : 'Press Enter to submit, Shift+Enter for new line'
                  }
                </p>
                <div className="text-xs text-gray-400 dark:text-gray-500">
                  {currentAnswer.length} characters
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Modal */}
      {showResults && results && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
            <div className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Interview Complete!</h2>
              
              {/* Score Only */}
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-blue-100 dark:bg-blue-900 mb-4">
                  <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">{results.score}%</span>
                </div>
                <p className="text-lg text-gray-600 dark:text-gray-400">Your Score</p>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/profile')}
                  disabled={!user}
                  className="w-full py-3 px-4 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {user ? 'View Profile' : 'Login to Save Results'}
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewPage;