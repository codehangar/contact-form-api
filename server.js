try {
    // Loads environment settings from '.env' into process.env
    // This is for local development
    require('dotenv').load();
} catch (e) {
    console.log('.env file not found')
}

var http = require('http');
var express = require('express');
var application = express();
var bodyParser = require('body-parser');
var routeConfig = require('./app/config/route-config');
var settingsConfig = require('./app/config/settings/settings-config');

function configureWorker(application) {
    configureApplication(application);
    configureRoutes(application);

    startServer(application);
}

function configureApplication(application) {
    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({
        extended: true
    }));

    application.use(function(req, res, next) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.type('application/json');
        next();
    });
}

function configureRoutes(application) {
    routeConfig.registerRoutes(application);
}

function startServer(application) {
    var server = http.createServer(application);

    server.listen(settingsConfig.settings.workerPort, function() {
        console.log('listening at http://%s:%s', settingsConfig.settings.hostName, settingsConfig.settings.workerPort);
    });
}

configureWorker(application);
