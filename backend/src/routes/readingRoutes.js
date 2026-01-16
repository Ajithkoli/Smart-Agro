const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getDeviceReadings } = require('../controllers/readingController');

router.get('/device/:deviceId', protect, getDeviceReadings);

module.exports = router;
