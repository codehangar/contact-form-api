var express = require('express');
var router = express.Router();

/** Routes **/
router.post('/', require('./contact.handler.js'));

module.exports = router;
