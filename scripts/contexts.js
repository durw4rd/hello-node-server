const LaunchDarkly = require('@launchdarkly/node-server-sdk');
const { faker } = require('@faker-js/faker');

require('dotenv').config();
const sdkKey = process.env.SDK_KEY;

// Set featureFlagKey to the feature flag key you want to evaluate.
const featureFlagKey = "DisplayMode";

function showMessage(s) {
    console.log("*** " + s);
    console.log("");
}

const initOptions = {
    logger: LaunchDarkly.basicLogger({ level: 'debug' }),
    application: {
        id: 'michals-demo-app',
        version: '1.0.1'
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
    "device": {
      "key": "Michal's MacBook"
    },
    "user": {
      "key": "mf-123",
      "name": "Michal LD",
      "domain": ".test.com"
    },
    "vnLdSession": {
      "key": "michalsSession02"
    }
  }

ldClient.waitForInitialization().then(function () {
    showMessage("SDK successfully initialized!");

    // ldClient.variation(featureFlagKey, multiContext, false, function (err, flagValue) {
    //     // showMessage("The variation for feature flag '" + featureFlagKey + "' is '" + flagValue + "' for user '" + context.user.key + "'");
    //     showMessage('Showing something to ' + multiContext);
    // });

    ldClient.allFlagsState(multiContext).then((flags) => console.log(flags));

    ldClient.track('BetPlacement', multiContext, null, 5);
    ldClient.track('LegsPerMulti', multiContext, null, 2);

    ldClient.flush(function () {
        ldClient.close();
    });
}).catch(function (error) {
    showMessage("SDK failed to initialize: " + error);
    process.exit(1);
});  