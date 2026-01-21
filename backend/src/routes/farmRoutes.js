const express = require('express');
const router = express.Router();
const {
    getFarms,
    getFarm,
    createFarm,
    updateFarm,
    deleteFarm,
} = require('../controllers/farmController');
const { protect } = require('../middleware/authMiddleware');

const upload = require('../middleware/uploadMiddleware');

router.route('/').get(protect, getFarms).post(protect, upload.single('image'), createFarm);
router.route('/:id').get(protect, getFarm).patch(protect, updateFarm).delete(protect, deleteFarm);

module.exports = router;
