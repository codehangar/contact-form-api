const express = require('express');
const router = express.Router();

router.use('/contact', require('./contact/contact.routes.js'));

module.exports = router;
