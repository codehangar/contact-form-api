const express = require('express');
const router = express.Router();

/** Routes **/
router.post('/:id', require('./contact.handler.js'));

module.exports = router;
