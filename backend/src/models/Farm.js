const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
    {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
        },
        location: {
            latitude: Number,
            longitude: Number,
            village: String,
            district: String,
            state: String,
        },
        areaInAcres: {
            type: Number,
        },
        primaryCrops: [String],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Farm', farmSchema);
