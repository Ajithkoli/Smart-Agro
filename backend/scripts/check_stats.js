const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const checkStats = async () => {
    await connectDB();

    const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }));
    const Farm = mongoose.model('Farm', new mongoose.Schema({}, { strict: false }));
    const Device = mongoose.model('SensorDevice', new mongoose.Schema({}, { strict: false }));

    const userCount = await User.countDocuments();
    const farmCount = await Farm.countDocuments();
    const deviceCount = await Device.countDocuments();

    console.log(`\n--- System Stats ---`);
    console.log(`Users: ${userCount}`);
    console.log(`Farms: ${farmCount}`);
    console.log(`Devices: ${deviceCount}`);
    console.log(`--------------------\n`);

    process.exit(0);
};

checkStats();
