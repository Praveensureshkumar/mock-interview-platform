const express = require('express');
const Question = require('../models/Question');
const InterviewResult = require('../models/InterviewResult');
const { auth, optionalAuth } = require('../middleware/auth');
const huggingFaceService = require('../services/huggingFaceService');

const router = express.Router();

// @route   GET /api/interview/questions
// @desc    Get AI-generated questions only (no database/fallback)
// @access  Public
router.get('/questions', async (req, res) => {
  try {
    const { testType, difficulty } = req.query;

    if (!testType || !difficulty) {
      return res.status(400).json({ message: 'Test type and difficulty are required' });
    }

    console.log('\n🤖 =================================');
    console.log(`🎯 AI QUESTION GENERATION REQUEST`);
    console.log(`📊 Category: ${testType.toUpperCase()}`);
    console.log(`📊 Difficulty: ${difficulty.toUpperCase()}`);
    console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
    console.log('🤖 =================================\n');
    
    // Generate ONLY AI questions with randomization
    const questions = await huggingFaceService.generateQuestions(testType, difficulty, 2);

    if (!questions || questions.length === 0) {
      console.log('❌ AI question generation completely failed');
      return res.status(404).json({ message: 'AI question generation failed. Please try again.' });
    }

    console.log('\n✅ =================================');
    console.log(`🎉 AI QUESTIONS GENERATED SUCCESSFULLY`);
    console.log(`📝 Count: ${questions.length}`);
    questions.forEach((q, index) => {
      console.log(`\n${index + 1}. QUESTION: ${q.question}`);
      console.log(`   🤖 AI Generated: ${q.aiGenerated}`);
      console.log(`   🆔 Unique ID: ${q.uniqueId}`);
    });
    console.log('✅ =================================\n');

    res.json({ 
      questions,
      metadata: {
        totalQuestions: questions.length,
        allAIGenerated: questions.every(q => q.aiGenerated)
      }
    });

  } catch (error) {
    console.error('\n❌ =================================');
    console.error('💥 AI Questions generation error:', error);
    console.error('❌ =================================\n');
    res.status(500).json({ message: 'Server error while generating AI questions' });
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

// @route   POST /api/interview/analyze-answer
// @desc    Analyze user answer using AI
// @access  Public
router.post('/analyze-answer', async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    console.log(`🧠 Analyzing answer with AI...`);
    
    // Analyze answer using Hugging Face AI
    const analysis = await huggingFaceService.analyzeAnswer(question, answer);

    console.log(`✅ Answer analyzed successfully. Score: ${analysis.score}`);
    
    res.json({
      success: true,
      analysis: analysis
    });

  } catch (error) {
    console.error('AI Answer analysis error:', error);
    res.status(500).json({ message: 'Server error while analyzing answer' });
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