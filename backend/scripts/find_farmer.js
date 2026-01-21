const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../src/models/User');
const Farm = require('../src/models/Farm');

dotenv.config({ path: path.join(__dirname, '../.env') });

const findFarmer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const query = "Halachandra";
        console.log(`Searching for "${query}"...`);

        const user = await User.findOne({
            name: { $regex: query, $options: 'i' }
        });

        if (user) {
            console.log("\n✅ FARMER FOUND:");
            console.log("--------------------------------");
            console.log(`ID:       ${user._id}`);
            console.log(`Name:     ${user.name}`);
            console.log(`Email:    ${user.email}`);
            console.log(`Phone:    ${user.phone || 'N/A'}`);
            console.log(`Role:     ${user.role}`);
            console.log(`Joined:   ${user.createdAt}`);

            // Find farms
            try {
                const farms = await Farm.find({ owner: user._id });
                if (farms.length > 0) {
                    console.log(`\n🏡 Owned Farms (${farms.length}):`);
                    farms.forEach(f => {
                        const loc = f.location ? `${f.location.village}, ${f.location.district}` : 'Unknown Location';
                        console.log(` - "${f.name}" (${f.areaInAcres} acres) @ ${loc}`);
                    });
                } else {
                    console.log("\n🏡 No farms registered.");
                }
            } catch (err) {
                console.log("\n⚠️ Could not fetch farms (Farm model might be missing or schema mismatch).");
            }
            console.log("--------------------------------");
        } else {
            console.log(`❌ No user found with name matching "${query}".`);
        }

    } catch (error) {
        console.error("DB Error:", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
};

findFarmer();
