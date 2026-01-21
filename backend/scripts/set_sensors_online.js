const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const SensorDevice = require('../src/models/SensorDevice');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const setOnline = async () => {
    await connectDB();

    try {
        const result = await SensorDevice.updateMany(
            {}, // Filter: all
            { $set: { status: 'online', lastSeenAt: new Date() } }
        );

        console.log(`✅ Updated ${result.modifiedCount} devices to ONLINE status.`);

    } catch (error) {
        console.error("Error updating devices:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

setOnline();
