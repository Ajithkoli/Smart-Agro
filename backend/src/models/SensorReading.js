const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema(
    {
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SensorDevice',
            required: true,
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        soilMoisture: {
            type: Number,
        },
        temperature: {
            type: Number,
        },
        humidity: {
            type: Number,
        },
        nitrogen: {
            type: Number,
        },
        phosphorus: {
            type: Number,
        },
        potassium: {
            type: Number,
        },
        pH: {
            type: Number,
        },
        lightIntensity: {
            type: Number,
        },
        rainfall: {
            type: Number,
        },
    }
);

// Index for efficient querying by device and time
sensorReadingSchema.index({ device: 1, timestamp: -1 });

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
