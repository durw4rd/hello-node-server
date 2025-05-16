const LaunchDarkly = require('@launchdarkly/node-server-sdk');
const { faker } = require('@faker-js/faker');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

function showMessage(s) {
    console.log("*** " + s);
    console.log("");
}

// -------------------------------------------------
// Edit the SDK init configuration
// -------------------------------------------------

const sdkKey = process.env.SDK_KEY; // set the key in the .env file

const initOptions = {
    logger: LaunchDarkly.basicLogger({ level: 'debug' }),
};
  
const ldClient = LaunchDarkly.init(sdkKey, initOptions);

// -------------------------------------------------
// Edit parameters provided to the SDK
// -------------------------------------------------

const featureFlagKey = "fun-flag-2";

const context = {
    "kind": "user",
    "key": "abcd1234",
    "arrayAttribute": ["vip", "boss"],
    "platform": "web"
};

const multiContext = {
    "kind": "multi",
    "user": {
        "key": "abcd1234",
        "arrayAttribute": ["vip", "boss"],
        "platform": "web"
    },
    "device": {
        "key": "michalsMCbook",
        "screensize": "big",
        "corporateProperty": true
    }
}

function createRandomUser() {
    return {
      userId: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
    };
}

// -------------------------------------------------
// Edit below for modifying interaction with the SDK
// -------------------------------------------------

ldClient.waitForInitialization().then(async function () {
    showMessage("SDK successfully initialized!");

    await bucketUsers();

    ldClient.flush(function () {
        console.log("All events have been sent!");
        ldClient.close(); // comment out if you want the app keep running
    });
}).catch(function (error) {
    showMessage("SDK failed to initialize: " + error);
    process.exit(1);
});

const evalNumber = 100;
async function bucketUsers() {
    // Create output directory if it doesn't exist
    const outputDir = path.join(__dirname, '..', 'output');
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    // Create CSV header
    const csvHeader = 'user_key,eval_number,flag_name,served_variation\n';
    const outputPath = path.join(outputDir, `${featureFlagKey}-variation-assignment.csv`);
    fs.writeFileSync(outputPath, csvHeader);

    for (let i = 0; i < evalNumber; i++) {
        const ldContext = {
            kind: "multi",
            user: {
                key: createRandomUser().userId,
                evalNumber: i
            }
        };
        
        const flagValue = await ldClient.variation(featureFlagKey, ldContext, false);
        const csvLine = `${ldContext.user.key},${i},${featureFlagKey},${flagValue}\n`;
        fs.appendFileSync(outputPath, csvLine);
        
        showMessage(`The variation for feature flag ${featureFlagKey} is ${flagValue} for user ${ldContext.user.key}`);
    }
}


