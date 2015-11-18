function ContactController() {

    var Slack = require('../../../services/slack/slack-service.js');
    var Email = require('../../../services/email/email-service.js');

    function post(req, res, next) {
        var contact = req.body;
        console.log('New Contact:');
        console.log(contact);

        Slack.newContact(contact, function(err, msg) {});
        Email.newContact(contact, function(err, msg) {});

        res.status(200).send('Thank you for contacting us!');
    }

    this.post = post;
}

module.exports = new ContactController();
