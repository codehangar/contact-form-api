var Slack = require('../../../services/slack/slack-service.js');
var Email = require('../../../services/email/email-service.js');

var handler = function(req, res, next) {
    var contact = req.body;
    console.log('New Contact:');
    console.log(contact);

    Slack.newContact(contact, function(err, msg) {});
    Email.newContact(contact, function(err, msg) {});

    res.status(200).send({
        message: 'Thank you for contacting us!'
    });
}

module.exports = handler;
