const SensorDevice = require('../models/SensorDevice');
const SensorReading = require('../models/SensorReading');
const Farm = require('../models/Farm');
const { generateRecommendations } = require('../services/recommendationService');

// @desc    Ingest sensor data from IoT device
// @route   POST /api/iot/ingest
// @access  Public (Protected by API Key)
const ingestData = async (req, res) => {
    const {
        deviceId,
        apiKey,
        soilMoisture,
        temperature,
        humidity,
        pH,
        lightIntensity,
        rainfall,
        timestamp,
    } = req.body;

    if (!deviceId || !apiKey) {
        return res.status(401).json({ message: 'Missing device credentials' });
    }

    try {
        // Validate Device and API Key
        // Note: In production, apiKey should be hashed. Here we compare raw for simplicity/demo.
        // To make it secure: await bcrypt.compare(apiKey, device.apiKey) if stored hashed

        // We need to explicitly select apiKey because it is select: false in model
        const device = await SensorDevice.findOne({ deviceId }).select('+apiKey');

        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        if (device.apiKey !== apiKey) {
            return res.status(401).json({ message: 'Invalid API Key' });
        }

        // Update Device Status
        device.lastSeenAt = new Date();
        device.status = 'online';
        await device.save();

        // Store Reading
        const reading = await SensorReading.create({
            device: device._id,
            timestamp: timestamp || Date.now(),
            soilMoisture,
            temperature,
            humidity,
            pH,
            lightIntensity,
            rainfall,
        });

        // Run Recommendation Engine
        const farm = await Farm.findById(device.farm);
        if (farm) {
            await generateRecommendations(reading, farm, device);
        }

        res.status(201).json({ success: true, readingId: reading._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { ingestData };
