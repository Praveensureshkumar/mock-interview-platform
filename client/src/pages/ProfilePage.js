import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { FiCalendar, FiTrendingUp, FiAward } from 'react-icons/fi';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProfilePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    improvementSuggestions: []
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadInterviewHistory();
  }, [user, navigate]);

  const loadInterviewHistory = async () => {
    try {
      setLoading(true);
      const response = await interviewAPI.getUserResults();
      const history = response.data.results;
      setInterviewHistory(history);
      calculateStats(history);
    } catch (error) {
      console.error('Failed to load interview history:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (history) => {
    if (history.length === 0) {
      setStats({
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        improvementSuggestions: ['Take your first interview to get personalized suggestions!']
      });
      return;
    }

    const totalInterviews = history.length;
    const scores = history.map(h => h.score);
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const bestScore = Math.max(...scores);

    // Generate improvement suggestions
    const suggestions = [];
    const testTypes = [...new Set(history.map(h => h.testType))];
    const difficulties = [...new Set(history.map(h => h.difficulty))];
    
    if (averageScore < 70) {
      suggestions.push('Focus on strengthening your fundamental concepts');
    }
    if (testTypes.length === 1) {
      suggestions.push('Try different interview types to broaden your skills');
    }
    if (!difficulties.includes('advanced')) {
      suggestions.push('Challenge yourself with advanced level questions');
    }
    if (suggestions.length === 0) {
      suggestions.push('Great progress! Keep practicing regularly to maintain your skills');
    }

    setStats({
      totalInterviews,
      averageScore,
      bestScore,
      improvementSuggestions: suggestions
    });
  };

  const chartData = {
    labels: interviewHistory.slice(-10).map((_, index) => `Interview ${index + 1}`),
    datasets: [
      {
        label: 'Score (%)',
        data: interviewHistory.slice(-10).map(h => h.score),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Your Recent Interview Scores',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      },
    },
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Profile</h1>
          <p className="mt-2 text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <FiCalendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Interviews</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.totalInterviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100">
                <FiTrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Score</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <FiAward className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Best Score</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.bestScore}%</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          {interviewHistory.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <Bar data={chartData} options={chartOptions} />
            </div>
          )}

          {/* Improvement Suggestions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Improvement Suggestions</h3>
            <div className="space-y-3">
              {stats.improvementSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <p className="text-gray-700">{suggestion}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
              >
                Start New Interview
              </button>
            </div>
          </div>
        </div>

        {/* Interview History */}
        <div className="mt-8 bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Interview History</h3>
          </div>
          
          {interviewHistory.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No interviews completed yet.</p>
              <button
                onClick={() => navigate('/')}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                Take Your First Interview
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Difficulty
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Mode
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {interviewHistory.map((interview) => (
                    <tr key={interview._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(interview.completedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {interview.testType.charAt(0).toUpperCase() + interview.testType.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                          {interview.difficulty.charAt(0).toUpperCase() + interview.difficulty.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {interview.mode === 'voice' ? 'Voice' : 'Text'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getScoreColor(interview.score)}`}>
                          {interview.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;