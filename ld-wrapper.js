var LaunchDarkly = require('launchdarkly-node-server-sdk');
require('dotenv').config();

module.exports = class LDManager {
    constructor() {
        this.client = null;
    }

    async #initialize() {
        const LDClient = LaunchDarkly.init(process.env.SDK_KEY);
        await LDClient.waitForInitialization().then(() => {
            return LDClient;
        });
    }

    async getLDClient() {
        if (this.LDClient) return this.LDClient;

        return await this.#initialize();
    }
};


// // Set sdkKey to your LaunchDarkly SDK key.
// const sdkKey = process.env.SDK_KEY;

// const LDManager = function () {
//     let launchDarklyClient;

//     async function initialize(sdkKey, user = { key: "anonymous" }, options = {}) {

//         const client = LDClient.initialize(sdkKey, user, options);
//         await client.waitForInitialization();

//         return client
//     }

//     async function getClient(sdkKey, user, options) {
//         if (launchDarklyClient) return launchDarklyClient;
//         return (launchDarklyClient = await initialize(sdkKey, user, options));
//     }

//     async function getVariation(key) {
//         const client = await getClient();

//         let evalResult = await client.variationDetail(key, false);
//         let { value, variationIndex, reason } = evalResult;
//         if (reason) {
//             let { inExperiment } = reason;
//             if (inExperiment) {
//                 console.log("We're in an experiment!");
//             };
//         };
//         return evalResult;
//     }

//     return {
//         getClient: getClient,
//         getVariation: getVariation
//     }
// }();

// // console.log(LDManager);

// const initOptions = {
//     evaluationReasons: false
// }

// const user = {
//     key: 'defaultWebUser',
//     name: 'Boris',
//     custom: {
//         experiment: true
//     }
// }

// async function app() {
//     await LDManager.getClient(clientId, user, initOptions);
//     let variation = await LDManager.getVariation('show-button');
//     console.log(variation);
// }

// app();