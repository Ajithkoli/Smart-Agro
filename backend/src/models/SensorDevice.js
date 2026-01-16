const mongoose = require('mongoose');

const sensorDeviceSchema = new mongoose.Schema(
    {
        farm: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm',
            required: true,
        },
        deviceId: {
            type: String,
            required: true,
            unique: true,
        },
        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['online', 'offline'],
            default: 'offline',
        },
        lastSeenAt: {
            type: Date,
        },
        apiKey: {
            type: String,
            required: true,
            select: false, // Do not return by default
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('SensorDevice', sensorDeviceSchema);
