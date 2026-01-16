const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { recommendCrop, getRecommendationHistory } = require('../controllers/cropController');

router.post('/recommend', protect, recommendCrop);
router.get('/history', protect, getRecommendationHistory);

module.exports = router;
