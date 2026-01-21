const mongoose = require('mongoose');
const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');
const SensorDevice = require('../src/models/SensorDevice');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Firebase
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
            }),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
        console.log("✅ Firebase Initialized");
    } catch (e) {
        console.error("❌ Firebase Init Failed:", e.message);
        process.exit(1);
    }
}

const db = admin.database();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const debugFlow = async () => {
    await connectDB();

    console.log("\n--- 1. Checking MongoDB Devices ---");
    const devices = await SensorDevice.find({});
    console.log(`Found ${devices.length} devices in MongoDB.`);

    if (devices.length === 0) {
        console.log("⚠️  No devices found in MongoDB. You need to 'Add Device' in the dashboard first.");
        console.log("   Make sure to use Device ID: 'SN-2024-TEST-001' to match dummy data.");
    }

    console.log("\n--- 2. Checking Firebase Data Mapping ---");

    for (const device of devices) {
        const fbPath = `devices/${device.deviceId}/readings`;
        console.log(`\n🔍 Checking Device: "${device.name}"`);
        console.log(`   Internal ID: ${device._id}`);
        console.log(`   Hardware ID: "${device.deviceId}"`);
        console.log(`   Expected Firebase Path: /${fbPath}`);

        try {
            const ref = db.ref(fbPath);
            const snapshot = await ref.limitToLast(5).once('value');
            const val = snapshot.val();

            if (val) {
                const count = Object.keys(val).length;
                console.log(`   ✅ Data FOUND in Firebase! (${count} readings detected)`);
                console.log(`   Sample Data keys: ${Object.keys(Object.values(val)[0]).join(', ')}`);
            } else {
                console.log(`   ❌ NO DATA found at this path.`);

                // Check if maybe it's at the root (common mistake)
                const rootRef = db.ref(`devices/${device.deviceId}`);
                const rootSnap = await rootRef.once('value');
                if (rootSnap.exists()) {
                    console.log(`   ⚠️  Wait! Data exists at /devices/${device.deviceId}, but maybe structure is wrong?`);
                    console.log(`   Keys found: ${Object.keys(rootSnap.val()).join(', ')}`);
                    if (!rootSnap.val().readings) {
                        console.log(`   ❌ Missing 'readings' child key. Structure should be: devices -> ID -> readings`);
                    }
                }
            }
        } catch (err) {
            console.error(`   ❌ Firebase Access Error: ${err.message}`);
        }
    }

    console.log("\n-----------------------------------");
    console.log("Done.");
    process.exit(0);
};

debugFlow();
