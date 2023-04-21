const LaunchDarkly = require('launchdarkly-node-server-sdk');
const InMemoryFeatureStore = require('launchdarkly-node-server-sdk/feature_store');

// Get SDK key from .env file
require('dotenv').config();
const sdkKey = process.env.SDK_KEY;

// For writing files to disk
var fs = require('fs');


// Initialize the interface/thing
featureStore = InMemoryFeatureStore();

const LDInitOptions = {
    logger: LaunchDarkly.basicLogger({ level: 'debug' }),
    featureStore 
};

const ldClient = LaunchDarkly.init(sdkKey, LDInitOptions);

ldClient.waitForInitialization().then(function() {

    // Check if featureStore is initialized
    featureStore.initialized((isInitialized) => {
        if (isInitialized) {
            
            getStoreData = (namespaceValue, callback) => {
                featureStore.all({ namespace: namespaceValue }, (output) => {
                    return callback(output);
                });
            } 
            
            let completeStore = {};

            // getStoreData('features', (flags) => {
            //     completeStore.flags = flags;
            // });

            // getStoreData('segments', (segments) => {
            //     completeStore.segments = segments;
            // });

            // fs.writeFile('featureStore.json', JSON.stringify(completeStore), (err) => {
            //     if(err) throw err;
            //     console.log('Finished writing flag & segmetn settings to a file!');
            // });

            featureStore.get({namespace: 'features'}, 'SportsBook', (result) => {
                console.log(result);
            })

        } else {
            console.log(`Feature store not initialized!`);
        }
    });
    
    // Flush any pending events and close the process
    ldClient.flush(function() {
        ldClient.close();
    });

}).catch(function(error) {
    console.log("SDK failed to initialize: " + error);
    process.exit(1);
});