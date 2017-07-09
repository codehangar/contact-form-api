console.log('process.env.NODE_ENV', process.env.NODE_ENV); // eslint-disable-line no-console
if (process.env.NODE_ENV === 'development') { // eslint-disable-line no-undef
    // Loads environment settings from '.env' into process.env
    // This is for local development
    require('dotenv').config();
}

const express = require('express');
const application = express();
const bodyParser = require('body-parser');
const CORSMiddleware = require('./src/middleware/cors.middleware.js');

/** General App Middleware **/
function configureApplication(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(CORSMiddleware);

    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
        // res.type('application/json');
        next();
    });
}

/** Register API Middleware **/
function configureRoutes(app) {
    /** Version 1 **/
    app.use('/api/v1', require('./src/api/v1/routes.js'));
    if (process.env.NODE_ENV === 'development') {
        app.use('/api/v1/docs', express.static(__dirname + '/src/api/v1/_docs'));
    }
}

function startServer(app) {
    const port = process.env.PORT || 9000;
    app.listen(port, () => {
        console.log('listening on port: %s', port); // eslint-disable-line no-console
    });
}

function configureWorker(app) {
    configureApplication(app);
    configureRoutes(app);
    startServer(app);
}

configureWorker(application);
