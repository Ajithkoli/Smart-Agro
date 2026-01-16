const mongoose = require('mongoose');

const plantDiseasePredictionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    imagePath: {
        type: String,
        required: true
    },
    disease: {
        type: String,
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    severity: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    treatment: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('PlantDiseasePrediction', plantDiseasePredictionSchema);
