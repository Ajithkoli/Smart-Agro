const SensorDevice = require('../models/SensorDevice');
const Farm = require('../models/Farm');
const crypto = require('crypto');

// @desc    Get all devices
// @route   GET /api/devices
// @access  Private
const getDevices = async (req, res) => {
    try {
        let query = {};

        // If filtering by farm
        if (req.query.farmId) {
            query.farm = req.query.farmId;
        }

        // Verify ownership of the farm(s) if not admin
        // This is a simplified check. A proper robust check would verify each device's farm owner.
        // For now, we will fetch devices and then filter (or rely on UI to query correct farmId).
        // Better approach: Find all farms owned by user, then find devices in those farms.

        if (req.user.role !== 'admin') {
            const userFarms = await Farm.find({ owner: req.user._id }).select('_id');
            const userFarmIds = userFarms.map(f => f._id);

            // If specific farm requested, ensure user owns it
            if (req.query.farmId) {
                if (!userFarmIds.some(id => id.toString() === req.query.farmId)) {
                    return res.status(401).json({ message: 'Not authorized for this farm' });
                }
            } else {
                // Show all devices for user's farms
                query.farm = { $in: userFarmIds };
            }
        }

        const devices = await SensorDevice.find(query).populate('farm', 'name');
        res.status(200).json(devices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Register new device
// @route   POST /api/devices
// @access  Private
const createDevice = async (req, res) => {
    const { farmId, name, deviceId, status } = req.body;

    if (!farmId || !deviceId || !name) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    // Verify farm ownership
    const farm = await Farm.findById(farmId);
    if (!farm) {
        return res.status(404).json({ message: 'Farm not found' });
    }
    if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
    }

    // Auto-generate API Key if not provided (usually server generates key for IoT)
    const apiKey = crypto.randomBytes(20).toString('hex');

    try {
        const device = await SensorDevice.create({
            farm: farmId,
            deviceId,
            name,
            status: status || 'online',
            apiKey, // In real app, hash this! returning raw here for setup
        });

        res.status(201).json({ ...device._doc, apiKey }); // Return key one-time
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete device
// @route   DELETE /api/devices/:id
// @access  Private
const deleteDevice = async (req, res) => {
    try {
        const device = await SensorDevice.findById(req.params.id);
        if (!device) return res.status(404).json({ message: 'Device not found' });

        // Verify ownership via farm
        const farm = await Farm.findById(device.farm);
        if (req.user.role !== 'admin' && farm.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await device.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getDevices,
    createDevice,
    deleteDevice
};
