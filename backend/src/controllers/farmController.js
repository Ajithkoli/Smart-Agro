const Farm = require('../models/Farm');

// @desc    Get all farms
// @route   GET /api/farms
// @access  Private
const getFarms = async (req, res) => {
    try {
        let query = {};
        // If not admin, only show own farms
        if (req.user.role !== 'admin') {
            query = { owner: req.user._id };
        }

        const farms = await Farm.find(query).populate('owner', 'name email');
        res.status(200).json(farms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single farm
// @route   GET /api/farms/:id
// @access  Private
const getFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to view this farm' });
        }

        res.status(200).json(farm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new farm
// @route   POST /api/farms
// @access  Private
const createFarm = async (req, res) => {
    let { name, location, areaInAcres, primaryCrops } = req.body;
    const imageUrl = req.file ? req.file.path : undefined;

    // Parse JSON strings if coming from FormData (Multipart)
    if (typeof location === 'string') {
        try {
            location = JSON.parse(location);
        } catch (e) {
            console.error('Error parsing location:', e);
        }
    }
    if (typeof primaryCrops === 'string') {
        try {
            primaryCrops = JSON.parse(primaryCrops); // Expecting ["Crop1", "Crop2"] string
        } catch (e) {
            // Fallback if it's just a comma-separated string
            primaryCrops = primaryCrops.split(',').map(c => c.trim());
        }
    }

    if (!name) {
        return res.status(400).json({ message: 'Please add a farm name' });
    }

    try {
        const farm = await Farm.create({
            owner: req.user._id,
            name,
            location,
            areaInAcres,
            primaryCrops,
            imageUrl,
        });

        res.status(201).json(farm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update farm
// @route   PATCH /api/farms/:id
// @access  Private
const updateFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        res.status(200).json(updatedFarm);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete farm
// @route   DELETE /api/farms/:id
// @access  Private
const deleteFarm = async (req, res) => {
    try {
        const farm = await Farm.findById(req.params.id);

        if (!farm) {
            return res.status(404).json({ message: 'Farm not found' });
        }

        // Check authorization
        if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await farm.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getFarms,
    getFarm,
    createFarm,
    updateFarm,
    deleteFarm,
};
