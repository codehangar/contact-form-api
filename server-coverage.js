'use strict';

const express = require('express');
const app = express();

/** Static Files */
app.use('/', express.static(__dirname + '/coverage/lcov-report/'));

const port = process.env.PORT || 8001;
app.listen(port, () => {
    console.log('listening on port: %s', port);
});
