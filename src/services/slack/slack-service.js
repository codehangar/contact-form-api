var request = require('request');
var _ = require('lodash');
var actions = require('../../data/actions.json');

function SlackService() {}


SlackService.prototype.init = function(action) {
    var config = {
        slackInfo: {
            "username": action.slack.username,
            "channel": action.slack.channel,
            "icon_emoji": action.slack.icon_emoji
        },
        signUpLocation: action.domain
    }

    return config;
}

SlackService.prototype.downloadCapture = function(action, payload, done) {

    var config = this.init(action);

    var jsonBody = _.extend({
        "attachments": [{
            "fallback": "New Download Request from " + config.signUpLocation + "!",
            "pretext": "New Download Request from " + config.signUpLocation + "! :money_with_wings:",
            "color": "#1CCDCD",
            "fields": [{
                "title": "Email",
                "value": payload.email,
                "short": false
            }]
        }]
    }, config.slackInfo);
    this.sendMessage(jsonBody, done);
}

SlackService.prototype.newContact = function(action, payload, done) {

    var config = this.init(action);

    var jsonBody = _.extend({
        "attachments": [{
            "fallback": "New Contact from " + config.signUpLocation + "!",
            "pretext": "New Contact from " + config.signUpLocation + "! :writing_hand:",
            "color": "#1CCDCD",
            "fields": [{
                "title": "Name",
                "value": payload.name,
                "short": false
            }, {
                "title": "Email",
                "value": payload.email,
                "short": false
            }, {
                "title": "Message",
                "value": payload.message,
                "short": false
            }]
        }]
    }, config.slackInfo);
    this.sendMessage(jsonBody, done);
}

SlackService.prototype.simple = function(action, text, done) {
    var config = this.init(action);

    var jsonBody = _.extend({
        text: text
    }, config.slackInfo);

    this.sendMessage(jsonBody, done);
}

SlackService.prototype.sendMessage = function(jsonBody, done) {

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

module.exports = new SlackService();
