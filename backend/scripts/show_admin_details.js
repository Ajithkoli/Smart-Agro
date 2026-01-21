const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');

dotenv.config({ path: path.join(__dirname, '../.env') });

const showAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const admin = await User.findOne({ email: 'admin@smartagri.com' });

        if (admin) {
            console.log("\n✅ ADMIN FOUND IN DATABASE!");
            console.log("---------------------------------------------------");
            console.log(`ID:        ${admin._id}`);
            console.log(`Name:      ${admin.name}`);
            console.log(`Email:     ${admin.email}`);
            console.log(`Role:      ${admin.role}`);
            console.log(`Created:   ${admin.createdAt}`);
            console.log("---------------------------------------------------");
            console.log("👉 Copy this ID and paste it in the Atlas 'Filter' box: { _id: ObjectId('...') }");
        } else {
            console.log("\n❌ Admin NOT found. (This is weird if create_admin said it exists!)");
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

showAdmin();
