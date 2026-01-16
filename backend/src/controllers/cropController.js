const CropRecommendation = require('../models/CropRecommendation');
const { spawn } = require('child_process');
const path = require('path');

// @desc    Recommend crop based on soil data
// @route   POST /api/crop/recommend
// @access  Private
const recommendCrop = async (req, res) => {
    try {
        const { N, P, K, temperature, humidity, ph, rainfall } = req.body;

        // Validation
        if (!N || !P || !K || !temperature || !humidity || !ph || !rainfall) {
            return res.status(400).json({ message: 'Please provide all soil parameters' });
        }

        const scriptPath = path.join(__dirname, '../../scripts/predict_crop.py');

        // Spawn python process
        // args: --N 90 --P 40 ...
        const args = [
            scriptPath,
            '--N', N,
            '--P', P,
            '--K', K,
            '--temperature', temperature,
            '--humidity', humidity,
            '--ph', ph,
            '--rainfall', rainfall
        ];

        const pythonProcess = spawn('python', args);

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
                return res.status(500).json({ message: 'Error processing data', error: errorString });
            }

            try {
                const predictionData = JSON.parse(dataString);

                if (predictionData.error) {
                    return res.status(500).json({ message: 'Prediction error', error: predictionData.error });
                }

                // Save to DB
                const recommendation = await CropRecommendation.create({
                    user: req.user._id,
                    N, P, K, temperature, humidity, ph, rainfall,
                    recommendedCrop: predictionData.recommendedCrop,
                    confidence: predictionData.confidence
                });

                res.status(201).json(recommendation);
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

// @desc    Get user's recommendation history
// @route   GET /api/crop/history
// @access  Private
const getRecommendationHistory = async (req, res) => {
    try {
        const history = await CropRecommendation.find({ user: req.user._id })
            .sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    recommendCrop,
    getRecommendationHistory
};
