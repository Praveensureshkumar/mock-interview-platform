const express = require('express');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

const router = express.Router();

// Test route
router.get('/test', (req, res) => {
    res.json({ message: 'Admin routes working' });
});

// POST /api/admin/questions - Upload new question
router.post('/questions', auth, async (req, res) => {
    try {
        const { question, testType, difficulty, keywords, category } = req.body;

        // Validate required fields
        if (!question || !testType || !difficulty || !keywords || !category) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Create new question
        const newQuestion = new Question({
            question,
            testType,
            difficulty,
            keywords: Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim()),
            category
        });

        await newQuestion.save();

        res.status(201).json({ 
            message: 'Question uploaded successfully', 
            question: newQuestion 
        });
    } catch (error) {
        console.error('Error uploading question:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;