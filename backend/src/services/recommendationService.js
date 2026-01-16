const Alert = require('../models/Alert');
// In a real app, this might use Google Vertex AI or a more complex rules engine

const generateRecommendations = async (reading, farm, device) => {
    const alerts = [];

    // Rule 1: Soil Moisture (Simple Threshold)
    if (reading.soilMoisture < 30) {
        alerts.push({
            farm: farm._id,
            device: device._id,
            title: 'Low Soil Moisture',
            description: `Moisture level is ${reading.soilMoisture}%. Consider irrigating the crops.`,
            level: 'HIGH',
        });
    }

    // Rule 2: Heat Stress
    if (reading.temperature > 35 && reading.humidity < 40) {
        alerts.push({
            farm: farm._id,
            device: device._id,
            title: 'Heat Stress Risk',
            description: `High temp (${reading.temperature}°C) and low humidity (${reading.humidity}%). Protect crops from heat stress.`,
            level: 'MEDIUM',
        });
    }

    // Rule 3: pH Balance
    if (reading.pH < 6.0 || reading.pH > 7.5) {
        alerts.push({
            farm: farm._id,
            device: device._id,
            title: 'pH Out of Optimal Range',
            description: `Current pH is ${reading.pH}. Optimal range is 6.0 - 7.5. Consider soil treatment.`,
            level: 'MEDIUM',
        });
    }

    // Save alerts to DB
    for (const alertData of alerts) {
        // Check if a similar unread alert already exists to avoid spamming
        const exists = await Alert.findOne({
            device: device._id,
            title: alertData.title,
            isRead: false,
        });

        if (!exists) {
            await Alert.create(alertData);
        }
    }

    return alerts; // Return generated alerts for immediate response if needed
};

module.exports = { generateRecommendations };
