const https = require('https');

const projectIds = ['smartagri-9647e-default-rtdb', 'smartagri-9647e'];
const domains = ['firebaseio.com', 'asia-southeast1.firebasedatabase.app', 'us-central1.firebasedatabase.app'];

const tryUrl = (url) => {
    return new Promise((resolve) => {
        const req = https.request(url + '/.json', { method: 'HEAD', timeout: 5000 }, (res) => {
            console.log(`[${res.statusCode}] ${url}`);
            if (res.statusCode !== 404 && res.statusCode !== 0) {
                resolve(true); // Found!
            } else {
                resolve(false);
            }
        });

        req.on('error', (e) => {
            console.log(`[ERR] ${url}: ${e.message}`);
            resolve(false);
        });

        req.on('timeout', () => {
            req.destroy();
            console.log(`[TIMEOUT] ${url}`);
            resolve(false);
        });

        req.end();
    });
};

const run = async () => {
    const urls = [
        `https://smartagri-9647e-default-rtdb.firebaseio.com`,
        `https://smartagri-9647e.firebaseio.com`,
        `https://smartagri-9647e-default-rtdb.asia-southeast1.firebasedatabase.app`,
        `https://smartagri-9647e-default-rtdb.us-central1.firebasedatabase.app`
    ];

    console.log("Checking URLs...");
    for (const url of urls) {
        if (await tryUrl(url)) {
            console.log("\n>>> SUCCESS: Found working URL: " + url);
            process.exit(0);
        }
    }
    console.log("\n>>> FAILURE: No working URL found.");
    process.exit(1);
};

run();
