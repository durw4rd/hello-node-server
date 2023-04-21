const LaunchDarkly = require('launchdarkly-node-server-sdk');
require('dotenv').config();

const sdkKey = process.env.SDK_KEY;

// Set featureFlagKey to the feature flag key you want to evaluate.
const featureFlagKey = "percentage-rollout-flag";

function showMessage(s) {
    console.log("*** " + s);
    console.log("");
}

const initOptions = {
    logger: LaunchDarkly.basicLogger({ level: 'debug' }),
    application: {
        id: 'app-gama',
        version: '1.0.0'
      }
};

const ldClient = LaunchDarkly.init(sdkKey, initOptions);

const context = {
    "kind": "user",
    "key": "abcd1235",
    // "name": "usersName",
    "arrayAttribute": ["vip", "boss"],
    "platform": "web"
};

const context2 = {
    "kind": "device",
    "key": "asdkjbvldwfkbv314487563294",
    "screensize": "big",
    "corporateProperty": true
}

const multiContext = {
    "kind": "multi",
    "user": {
        "key": "abcd1235",
        "arrayAttribute": ["vip", "boss"],
        "platform": "web"
    },
    "device": {
        "key": "michalsMCbook",
        "screensize": "big",
        "corporateProperty": true
    }
}

ldClient.waitForInitialization().then(function () {
    showMessage("SDK successfully initialized!");

    ldClient.variation(featureFlagKey, context2, false, function (err, flagValue) {
        // showMessage("The variation for feature flag '" + featureFlagKey + "' is '" + flagValue + "' for user '" + context.user.key + "'");
        showMessage('Showing something to someone');
    });


    ldClient.flush(function () {
        ldClient.close();
    });
}).catch(function (error) {
    showMessage("SDK failed to initialize: " + error);
    process.exit(1);
});  