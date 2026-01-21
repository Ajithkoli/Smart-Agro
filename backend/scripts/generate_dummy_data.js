const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '../dummy_firebase_data.json');

// Configuration
const DEVICE_IDS = [
    'SN-2024-TEST-001', // Existing
    'SN-2024-TEST-002', // Existing
    'SN-2024-TEST-003', // New
    'SN-2024-TEST-004', // New
    'SN-2024-TEST-005'  // New
];

const DEVICE_NAMES = [
    'Field Alpha Sensor',
    'Greenhouse Beta',
    'Orchard Gamma',
    'Hydroponic Delta',
    'Vertical Farm Epsilon'
];

const METRICS_CONFIG = {
    nitrogen: { min: 20, max: 100, variance: 5 },
    phosphorus: { min: 20, max: 80, variance: 5 },
    potassium: { min: 20, max: 80, variance: 5 },
    temperature: { base: 25, amp: 5 }, // Sine wave
    humidity: { base: 60, amp: 15 },   // Sine wave
    pH: { min: 5.5, max: 7.5, variance: 0.2 },
    rainfall: { min: 0, max: 50, chance: 0.1 }, // 10% chance of rain
    soilMoisture: { min: 30, max: 80, variance: 3 }
};

const generateReadings = (count) => {
    const readings = {};
    const now = Date.now(); // Current timestamp (2026 in user's context)
    const interval = 1000 * 60 * 15; // 15 minutes

    for (let i = 0; i < count; i++) {
        // Go backwards in time
        const time = now - ((count - 1 - i) * interval);
        const timeDate = new Date(time);

        // Simulate daily cycle for temp/humidity based on hour
        const hour = timeDate.getHours();
        const cycle = Math.sin(((hour - 6) / 24) * 2 * Math.PI); // Peak at ~12:00

        const r = {
            timestamp: time,
            nitrogen: Math.floor(Math.random() * (METRICS_CONFIG.nitrogen.max - METRICS_CONFIG.nitrogen.min) + METRICS_CONFIG.nitrogen.min),
            phosphorus: Math.floor(Math.random() * (METRICS_CONFIG.phosphorus.max - METRICS_CONFIG.phosphorus.min) + METRICS_CONFIG.phosphorus.min),
            potassium: Math.floor(Math.random() * (METRICS_CONFIG.potassium.max - METRICS_CONFIG.potassium.min) + METRICS_CONFIG.potassium.min),

            // Temperature follows day cycle + random noise
            temperature: parseFloat((METRICS_CONFIG.temperature.base + (cycle * METRICS_CONFIG.temperature.amp) + (Math.random() - 0.5)).toFixed(1)),

            // Humidity is inverse to temp usually
            humidity: parseFloat((METRICS_CONFIG.humidity.base - (cycle * METRICS_CONFIG.humidity.amp) + (Math.random() * 5)).toFixed(1)),

            pH: parseFloat((Math.random() * (METRICS_CONFIG.pH.max - METRICS_CONFIG.pH.min) + METRICS_CONFIG.pH.min).toFixed(1)),

            rainfall: Math.random() < METRICS_CONFIG.rainfall.chance ? parseFloat((Math.random() * METRICS_CONFIG.rainfall.max).toFixed(1)) : 0,

            soilMoisture: Math.floor(Math.random() * (METRICS_CONFIG.soilMoisture.max - METRICS_CONFIG.soilMoisture.min) + METRICS_CONFIG.soilMoisture.min)
        };

        // Key: unique ID
        readings[`r_${time}`] = r;
    }
    return readings;
};

const generateData = () => {
    const data = { devices: {} };

    DEVICE_IDS.forEach((id, index) => {
        data.devices[id] = {
            name: DEVICE_NAMES[index],
            status: 'online', // This assumes backend syncs it, but we handle that separately
            lastUpdated: Date.now(),
            readings: generateReadings(50) // 50 data points
        };
    });

    try {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2));
        console.log(`✅ Generated extensive data for ${DEVICE_IDS.length} devices to ${OUTPUT_FILE}`);
        console.log("   Device IDs generated:");
        DEVICE_IDS.forEach(id => console.log(`   - ${id}`));
    } catch (e) {
        console.error("Error writing file:", e);
    }
};

generateData();
