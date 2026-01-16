const admin = require('firebase-admin');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

// Initialize Firebase
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const db = admin.database();

async function checkData() {
    const deviceId = 'sensor-01'; // Hardcoded based on previous step
    console.log(`Checking data for: ${deviceId}`);

    try {
        // Check root of device
        const deviceRef = db.ref(`devices/${deviceId}`);
        const snapshot = await deviceRef.once('value');
        const val = snapshot.val();

        console.log("\n--- FULL DEVICE DATA ---");
        console.log(JSON.stringify(val, null, 2));
        console.log("------------------------\n");

        if (!val) {
            console.log("❌ Device node does not exist.");
        } else if (!val.readings) {
            console.log("❌ 'readings' folder is MISSING. Data might be in the wrong place.");
        } else {
            console.log("✅ 'readings' folder exists.");
            const readings = val.readings;
            const keys = Object.keys(readings);
            console.log(`Found ${keys.length} reading entries.`);
        }
        process.exit(0);
    } catch (error) {
        console.error("Error:", error);
        process.exit(1);
    }
}

checkData();
