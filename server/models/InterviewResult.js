const mongoose = require('mongoose');

const interviewResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null // Allow null for guest users
  },
  testType: {
    type: String,
    required: true,
    enum: ['fullstack', 'frontend', 'backend', 'hr']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  mode: {
    type: String,
    required: true,
    enum: ['typed', 'voice']
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    question: String,
    answer: String,
    timestamp: Date
  }],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('InterviewResult', interviewResultSchema);