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

async function listDevices() {
    try {
        const ref = db.ref('devices');
        const snapshot = await ref.once('value');
        const data = snapshot.val();

        if (!data) {
            console.log("No devices found in Firebase.");
            return;
        }

        console.log("\n--- AVAILABLE DEVICE IDs ---");
        Object.keys(data).forEach(key => {
            console.log(` -> ${key}`);
        });
        console.log("----------------------------\n");
        process.exit(0);
    } catch (error) {
        console.error("Error fetching devices:", error);
        process.exit(1);
    }
}

listDevices();
