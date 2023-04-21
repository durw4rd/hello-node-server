const LaunchDarkly = require('launchdarkly-node-server-sdk');
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

const featureFlagKey = "<FLAG-KEY>";

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

// -------------------------------------------------
// Edit below for modifying interaction with the SDK
// -------------------------------------------------

ldClient.waitForInitialization().then(function () {
    showMessage("SDK successfully initialized!");

    ldClient.variation(featureFlagKey, context, false, function (err, flagValue) {
        showMessage(`The variation for feature flag ${featureFlagKey} is ${flagValue} for user ${context.key}`);
    });

    ldClient.flush(function () {
        ldClient.close(); // comment out if you want the app keep running
    });
}).catch(function (error) {
    showMessage("SDK failed to initialize: " + error);
    process.exit(1);
});
