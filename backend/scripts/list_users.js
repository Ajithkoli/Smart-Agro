const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const listUsers = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to: ${conn.connection.name} (on ${conn.connection.host})`); // Log DB Name

        const users = await User.find({});
        console.log(`\nFound ${users.length} users:`);
        users.forEach(u => {
            console.log(` - [${u.role}] ${u.name} (${u.email})`);
        });

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

listUsers();
