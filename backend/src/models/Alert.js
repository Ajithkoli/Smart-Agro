const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
    {
        farm: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Farm',
        },
        device: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SensorDevice',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        level: {
            type: String,
            enum: ['LOW', 'MEDIUM', 'HIGH'],
            default: 'LOW',
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Alert', alertSchema);
