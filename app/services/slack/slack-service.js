function SlackService() {
    var request = require('request');
    var _ = require('lodash');

    var baseInfo = {
        "username": process.env.SLACK_USER,
        "channel": process.env.SLACK_CHANNEL,
        "icon_emoji": ":mailbox_with_mail:"
    };
    var signUpLocation = process.env.SIGNUP_LOCATION;

    function newContact(contact, done) {
        var jsonBody = _.extend({
            "attachments": [{
                "fallback": "New Contact from " + signUpLocation + "!",
                "pretext": "New Contact from " + signUpLocation + "! :writing_hand:",
                "color": "#1CCDCD",
                "fields": [{
                    "title": "Name",
                    "value": contact.name,
                    "short": false
                }, {
                    "title": "Email",
                    "value": contact.email,
                    "short": false
                }, {
                    "title": "Message",
                    "value": contact.message,
                    "short": false
                }]
            }]
        }, baseInfo);
        sendMessage(jsonBody, done);
    }

    function simple(text, done) {
        var jsonBody = _.extend({
            text: text
        }, baseInfo);

        sendMessage(jsonBody, done);
    }

    function sendMessage(jsonBody, done) {
        // console.log("jsonBody", jsonBody)
        // return;
        var options = {
            method: 'POST',
            url: process.env.SLACK_WEBHOOK,
            json: jsonBody
        };
        request(options, function(error, response, body) {
            if (error) {
                console.error(error);
                done(error);
            } else {
                done(null, 'Slack message sent: ' + body);
            }
        });
    }

    this.newContact = newContact;
    this.simple = simple;
}

module.exports = new SlackService();
