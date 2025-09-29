const express = require('express');
const Question = require('../models/Question');
const InterviewResult = require('../models/InterviewResult');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/interview/questions
// @desc    Get questions by test type and difficulty
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    const { testType, difficulty } = req.query;

    if (!testType || !difficulty) {
      return res.status(400).json({ message: 'Test type and difficulty are required' });
    }

    // Get random questions for the specified criteria
    const questions = await Question.aggregate([
      { $match: { testType, difficulty } },
      { $sample: { size: 5 } } // Get 5 random questions
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the specified criteria' });
    }

    res.json({ questions });

  } catch (error) {
    console.error('Questions fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching questions' });
  }
});

// @route   POST /api/interview/results
// @desc    Save interview result
// @access  Public (with optional auth)
router.post('/results', optionalAuth, async (req, res) => {
  try {
    const { testType, difficulty, mode, questions, answers, score, completedAt } = req.body;

    const interviewResult = new InterviewResult({
      userId: req.user ? req.user._id : null, // Save user ID if authenticated
      testType,
      difficulty,
      mode,
      questions,
      answers,
      score,
      completedAt
    });

    await interviewResult.save();

    res.status(201).json({
      success: true,
      message: 'Interview result saved successfully',
      result: interviewResult
    });

  } catch (error) {
    console.error('Save result error:', error);
    res.status(500).json({ message: 'Server error while saving result' });
  }
});

// @route   GET /api/interview/user-results
// @desc    Get user's interview results
// @access  Private
router.get('/user-results', auth, async (req, res) => {
  try {
    const results = await InterviewResult.find({ userId: req.user._id })
      .populate('questions', 'question category')
      .sort({ completedAt: -1 });

    res.json({ results });

  } catch (error) {
    console.error('User results fetch error:', error);
    res.status(500).json({ message: 'Server error while fetching results' });
  }
});

module.exports = router;