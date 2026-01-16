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

const checkFarms = async () => {
    await connectDB();

    // We need to define schema briefly or use existing model if require works with relative paths easily
    // Let's rely on basic mongoose connection and define a temporary schema to avoid path complexities if not needed
    const farmSchema = new mongoose.Schema({}, { strict: false });
    const Farm = mongoose.model('Farm', farmSchema);

    const farms = await Farm.find({});
    console.log(`\nTotal Farms Found: ${farms.length}`);
    farms.forEach((f, index) => {
        console.log(`${index + 1}. ID: ${f._id} | Name: ${f.name} | Owner: ${f.owner}`);
    });

    process.exit(0);
};

checkFarms();
