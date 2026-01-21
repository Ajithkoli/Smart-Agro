const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

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

const createAdmin = async () => {
    await connectDB();

    try {
        const adminEmail = 'admin@smartagri.com';

        const userExists = await User.findOne({ email: adminEmail });

        if (userExists) {
            console.log('⚠️ Admin user already exists');
        } else {
            const user = await User.create({
                name: 'System Admin',
                email: adminEmail,
                password: 'admin123', // Will be hashed by pre-save hook
                role: 'admin',
                phone: '0000000000'
            });
            console.log(`✅ Admin user created: ${user.email}`);
            console.log(`   Password: admin123`);
        }

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

createAdmin();
