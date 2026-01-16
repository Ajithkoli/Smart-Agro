const mongoose = require('mongoose');

const cropRecommendationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    farm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farm'
    },
    // Input parameters
    N: { type: Number, required: true },
    P: { type: Number, required: true },
    K: { type: Number, required: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    ph: { type: Number, required: true },
    rainfall: { type: Number, required: true },

    // Output
    recommendedCrop: { type: String, required: true },
    confidence: { type: Number },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('CropRecommendation', cropRecommendationSchema);
