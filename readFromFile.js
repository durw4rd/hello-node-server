const LaunchDarkly = require('launchdarkly-node-server-sdk');
const { FileDataSource } = require('launchdarkly-node-server-sdk/integrations');

// Get SDK key from .env file
require('dotenv').config();
const sdkKey = process.env.SDK_KEY;

const dataSource = FileDataSource({
  paths: [ 'featureStore.json' ]
});

const options = {
  updateProcessor: dataSource
};

const ldclient = LaunchDarkly.init(sdkKey, options);

const user = {
    "key": "my-favourite-user",
    "custom": {
       "groups": ["vip", "boss"],
       "platform": "web"
    }
};

ldclient.waitForInitialization().then(function() {
    console.log("Client initialized!");

    ldclient.allFlagsState(user, { withReasons: true }, (err, allFlags) => {
        const flagsStore = allFlags.toJSON().$flagsState;

        for (const [key, value] of Object.entries(flagsStore)) {
            console.log(`Version of flag "${key}": ${value.version}`);
        }
    })
})
