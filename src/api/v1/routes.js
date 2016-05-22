var express = require('express');
var router = express.Router();

router.use('/contact', require('./contact/contact.routes.js'));

module.exports = router;
