const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

const cleanup = async () => {
    await connectDB();
    const farmSchema = new mongoose.Schema({}, { strict: false });
    const Farm = mongoose.model('Farm', farmSchema);

    // ID found in previous step: 6936b173c8e656388878d8ea
    const idToDelete = '6936b173c8e656388878d8ea';

    console.log(`Deleting farm with ID: ${idToDelete}...`);
    const result = await Farm.deleteOne({ _id: idToDelete });

    console.log(`Deleted Count: ${result.deletedCount}`);

    const remaining = await Farm.countDocuments();
    console.log(`Remaining Farms: ${remaining}`);

    process.exit(0);
};

cleanup();
