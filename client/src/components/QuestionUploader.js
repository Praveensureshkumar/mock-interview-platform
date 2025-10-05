import React, { useState } from 'react';
import axios from 'axios';

const QuestionUploader = () => {
    const [question, setQuestion] = useState({
        question: '',
        testType: 'fullstack',
        difficulty: 'intermediate',
        keywords: '',
        category: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const questionData = {
                ...question,
                keywords: question.keywords.split(',').map(k => k.trim())
            };

            await axios.post('http://localhost:5000/api/admin/questions', questionData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage('✅ Question uploaded successfully!');
            setQuestion({
                question: '',
                testType: 'fullstack',
                difficulty: 'intermediate',
                keywords: '',
                category: ''
            });
        } catch (error) {
            setMessage('❌ Error uploading question: ' + error.response?.data?.message);
        }
        setLoading(false);
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">
                📝 Upload Your Questions
            </h2>
            
            {message && (
                <div className={`p-3 mb-4 rounded ${message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Question *
                    </label>
                    <textarea
                        value={question.question}
                        onChange={(e) => setQuestion({...question, question: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        required
                        placeholder="Enter your interview question..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Test Type *
                        </label>
                        <select
                            value={question.testType}
                            onChange={(e) => setQuestion({...question, testType: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="fullstack">Full Stack</option>
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="hr">HR</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Difficulty *
                        </label>
                        <select
                            value={question.difficulty}
                            onChange={(e) => setQuestion({...question, difficulty: e.target.value})}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                    </label>
                    <input
                        type="text"
                        value={question.category}
                        onChange={(e) => setQuestion({...question, category: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="e.g., JavaScript Fundamentals, React Framework..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Keywords (comma-separated) *
                    </label>
                    <input
                        type="text"
                        value={question.keywords}
                        onChange={(e) => setQuestion({...question, keywords: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        placeholder="keyword1, keyword2, keyword3..."
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
                >
                    {loading ? '📤 Uploading...' : '📤 Upload Question'}
                </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
                <h3 className="font-semibold text-gray-700 mb-2">💡 Tips:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Make questions clear and specific</li>
                    <li>• Add relevant keywords for better scoring</li>
                    <li>• Write comprehensive sample answers</li>
                    <li>• Mix different difficulty levels</li>
                </ul>
            </div>
        </div>
    );
};

export default QuestionUploader;