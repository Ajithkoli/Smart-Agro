const Alert = require('../models/Alert');
const Farm = require('../models/Farm');

// @desc    Get alerts for a farm
// @route   GET /api/recommendations/farm/:farmId
// @access  Private
const getRecommendations = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.farmId);

        if (!farm) return res.status(404).json({ message: 'Farm not found' });

        // Auth check
        if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const alerts = await Alert.find({ farm: req.params.farmId }).sort({ createdAt: -1 });

        res.status(200).json(alerts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getRecommendations };
