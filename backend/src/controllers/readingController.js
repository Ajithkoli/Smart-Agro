const SensorReading = require('../models/SensorReading');
const SensorDevice = require('../models/SensorDevice');
const { db } = require('../config/firebaseAdmin');

// @desc    Get readings for a specific device
// @route   GET /api/readings/device/:deviceId
// @access  Private
const getDeviceReadings = async (req, res) => {
    try {
        const { deviceId } = req.params;
        const { limit = 50 } = req.query;

        // Check availability
        const device = await SensorDevice.findById(deviceId);
        if (!device) {
            return res.status(404).json({ message: 'Device not found' });
        }

        // Authorization checks
        await device.populate('farm');
        if (device.farm.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view these readings' });
        }

        // Fetch from Firebase Realtime Database
        // Path Assumption: devices/{device_hardware_serial_id}/readings
        // We use device.deviceId which stores the Hardware ID/Serial
        const ref = db.ref(`devices/${device.deviceId}/readings`);

        const snapshot = await ref.orderByChild('timestamp').limitToLast(parseInt(limit)).once('value');

        const readings = [];
        snapshot.forEach((childSnapshot) => {
            readings.push(childSnapshot.val());
        });

        // Backend returns newest first usually, or whatever the frontend chart expects (oldest first?)
        // Recharts usually wants oldest first (left to right). 
        // Snapshot.forEach iterates in order of query (timestamp ascending).
        // So readings are Oldest -> Newest.

        res.json(readings);
    } catch (error) {
        console.error('Error fetching readings:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = {
    getDeviceReadings
};
