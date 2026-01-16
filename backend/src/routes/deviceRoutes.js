const express = require('express');
const router = express.Router();
const {
    getDevices,
    createDevice,
    deleteDevice
} = require('../controllers/deviceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getDevices).post(protect, createDevice);
router.route('/:id').delete(protect, deleteDevice);

module.exports = router;
