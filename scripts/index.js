const LaunchDarkly = require('launchdarkly-node-server-sdk');
const InMemoryFeatureStore = require('launchdarkly-node-server-sdk/feature_store');
require('dotenv').config();
// const LDManager = require('./ld-wrapper');
// const User = require('./user');

// Set sdkKey to your LaunchDarkly SDK key.
const sdkKey = process.env.SDK_KEY;

// Set featureFlagKey to the feature flag key you want to evaluate.
const featureFlagKey = "building-materials";

function showMessage(s) {
  console.log("*** " + s);
  console.log("");
}

// async function main() {
//   const ldWrapper = new LDManager();

//   const ldClient = await ldWrapper.getLDClient();
//   console.log(ldClient);
// } 
// main();


// if (sdkKey == "") {
//   showMessage("Please edit index.js to set sdkKey to your LaunchDarkly SDK key first");
//   process.exit(1);
// }

let featureStore = InMemoryFeatureStore(); // this is necessary

const initOptions = {
  logger: LaunchDarkly.basicLogger({ level: 'debug' }),
  featureStore
};

const ldClient = LaunchDarkly.init(sdkKey, initOptions);

// Set up the user properties. This user should appear on your LaunchDarkly users dashboard
// soon after you run the demo.
const user = {
   "key": "my-favourite-user",
   "custom": {
      "groups": ["vip", "boss"],
      "platform": "web"
   }
};

ldClient.waitForInitialization().then(function() {
  showMessage("SDK successfully initialized!");

  // ldClient.variation(featureFlagKey, user, false, function(err, flagValue) {
  //   showMessage("The variation for feature flag '" + featureFlagKey + "' is '" + flagValue + "' for user '" + user.key + "'");
  // });

  console.log(featureStore);
  featureStore.initialized((isInitialized) => {
    console.log(`Is featureStore initialized? -> ${isInitialized}`);
  });

  featureStore.all({namespace: 'features'}, (allFlagSettings) => {
    console.log(allFlagSettings);
  });

  // ldClient.allFlagsState(user, { withReasons: true }, (err, allFlags) => {
  //   const flagsStore = allFlags.toJSON().$flagsState;

  //   for (const [key, value] of Object.entries(flagsStore)) {
  //     console.log(`Version of flag "${key}": ${value.version}`);
  //   }
  // })

  // featureStore.initialized((isInitialized) => {
  //   console.log("something ELSE is happening!");
  //   console.log(isInitialized);
  // });

  // featureStore.all({namespace: 'features'}, (allFlagSettings) => {
  //   console.log(allFlagSettings);
  // });

  ldClient.on("update", (event) => {
    console.log(event);

    ldClient.allFlagsState(user, { withReasons: true }, (err, allFlags) => {
      const flagsStore = allFlags.toJSON().$flagsState;
  
      for (const [key, value] of Object.entries(flagsStore)) {
        console.log(`Version of flag "${key}": ${value.version}`);
      }
    })

  })

  // /* Example implementation using variationDetail instead of variation
  
  // function variation(flag, fallback) {
  //   const {reason,value}  = ldclient.variationDetail(flag,fallback)
  //   if (reason.kind == 'ERROR') {
  //      // notify something
  //   }
  //   return value
  // }

  // */
 
  // ldClient.track("Conversion event 1", user);
  // ldClient.flush(function() {
  //   ldClient.close();
  // });

}).catch(function(error) {
  showMessage("SDK failed to initialize: " + error);
  process.exit(1);
});
