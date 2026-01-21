const axios = require('axios');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const debugApi = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // 1. Get Farmer User
        const email = 'ajithkoli.cs23@rvce.edu.in';
        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User ${email} not found`);
            process.exit(1);
        }

        // 2. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        console.log(`✅ Generated Token for ${user.name} (${user.role})`);

        // 3. Make GET Request
        console.log("\nTesting GET /api/farms...");
        try {
            const res = await axios.get('http://localhost:5000/api/farms', {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ GET Success! Status:", res.status);
            console.log("Data:", JSON.stringify(res.data, null, 2));
        } catch (err) {
            console.log("❌ GET Failed! Status:", err.response?.status);
            console.log("Error:", err.response?.data?.message || err.message);
        }

        // 4. Make POST Request (Test Farm)
        console.log("\nTesting POST /api/farms (No Image)...");
        try {
            const res = await axios.post('http://localhost:5000/api/farms', {
                name: "Debug Farm " + Date.now(),
                location: { village: "Test", district: "Test", state: "Test" },
                areaInAcres: 5,
                primaryCrops: ["DebugCrop"]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ POST Success! Status:", res.status);
            console.log("New Farm ID:", res.data._id);
        } catch (err) {
            console.log("❌ POST Failed! Status:", err.response?.status);
            console.log("Error:", err.response?.data?.message || err.message);
            if (err.response?.data) console.log(err.response.data);
        }

    } catch (error) {
        console.error("Script Error:", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

debugApi();
