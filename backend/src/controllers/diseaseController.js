const PlantDiseasePrediction = require('../models/PlantDiseasePrediction');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// @desc    Predict disease from image
// @route   POST /api/disease/predict
// @access  Private
const predictDisease = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        const imagePath = req.file.path;
        const scriptPath = path.join(__dirname, '../../scripts/predict_disease.py');

        // Spawn python process
        const pythonProcess = spawn('python', [scriptPath, imagePath]);

        let dataString = '';
        let errorString = '';

        pythonProcess.stdout.on('data', (data) => {
            dataString += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            errorString += data.toString();
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                console.error('Python script error:', errorString);
                return res.status(500).json({ message: 'Error processing image', error: errorString });
            }

            try {
                const predictionData = JSON.parse(dataString);

                // Save to DB
                const prediction = await PlantDiseasePrediction.create({
                    user: req.user._id,
                    imagePath: imagePath, // In production, upload to cloud storage and save URL
                    disease: predictionData.disease,
                    confidence: predictionData.confidence,
                    severity: predictionData.severity,
                    treatment: predictionData.treatment
                });

                res.status(201).json(prediction);
            } catch (err) {
                console.error('Parsing error:', err);
                res.status(500).json({ message: 'Error parsing prediction results' });
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's prediction history
// @route   GET /api/disease/history
// @access  Private
const getPredictionHistory = async (req, res) => {
    try {
        const history = await PlantDiseasePrediction.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    predictDisease,
    getPredictionHistory
};
