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
var corsMiddleware = require('./src/middleware/cors.middleware.js');

function configureWorker(application) {
    configureApplication(application);
    configureRoutes(application);

    startServer(application);
}

/** General App Middleware **/
function configureApplication(application) {
    application.use(bodyParser.json());
    application.use(bodyParser.urlencoded({
        extended: true
    }));
    application.use(corsMiddleware);

    application.use(function(req, res, next) {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        res.type('application/json');
        next();
    });
}

/** Register API Middleware **/
function configureRoutes(application) {
    /** Version 1 **/
    application.use('/api/v1/docs', express.static('./src/api/v1/_docs'));
    application.use('/api/v1', require('./src/api/v1/routes.js'));
}

function startServer(application) {
    var port = process.env.PORT || 9000;
    var server = application.listen(port, function() {
        console.log('listening on port: %s', port);
    });
}

configureWorker(application);
