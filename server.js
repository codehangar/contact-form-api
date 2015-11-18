try {
    // Loads environment settings from '.env' into process.env
    // This is for local development
    require('dotenv').load();
} catch (e) {
    console.log('.env file not found')
}

var settingsConfig = require('./app/config/settings/settings-config');

if (settingsConfig.settings.clusterEnabled === 1) {
    require('cluster-service').start({
        workers: './app/config/worker-config.js',
        accessKey: settingsConfig.settings.clusterAccessKey,
        host: settingsConfig.settings.hostName,
        port: settingsConfig.settings.masterPort
    });
} else {
    require('./app/config/worker-config.js');
}
