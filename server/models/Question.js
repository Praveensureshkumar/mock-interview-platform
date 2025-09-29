const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
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
  keywords: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);