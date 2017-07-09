const request = require('request');
const _ = require('lodash');

const init = (action) => {
    const config = {
        slackInfo: {
            'username': action.slack.username,
            'channel': action.slack.channel,
            'icon_emoji': action.slack.icon_emoji
        },
        signUpLocation: action.domain
    };

    return config;
};

const sendMessage = (jsonBody, done) => {
    const options = {
        method: 'POST',
        url: process.env.SLACK_WEBHOOK,
        json: jsonBody
    };
    request(options, (error, response, body) => {
        if (error) {
            console.error(error);
            done(error);
        } else {
            done(null, 'Slack message sent: ' + body);
        }
    });
};


function SlackService() {
}

SlackService.prototype.downloadCapture = (action, payload, done) => {
    const config = init(action);

    const jsonBody = _.extend({
        'attachments': [{
            'fallback': 'New Download Request from ' + config.signUpLocation + '!',
            'pretext': 'New Download Request from ' + config.signUpLocation + '! :money_with_wings:',
            'color': '#1CCDCD',
            'fields': [{
                'title': 'Email',
                'value': payload.email,
                'short': false
            }]
        }]
    }, config.slackInfo);
    sendMessage(jsonBody, done);
};

SlackService.prototype.newContact = (action, payload, done) => {
    const config = init(action);

    const fields = Object.keys(payload).map((key) => {
        return {
            'title': key.charAt(0).toUpperCase() + key.slice(1),
            'value': payload[key],
            'short': false
        };
    });

    const jsonBody = _.extend({
        'attachments': [{
            'fallback': 'New Contact from ' + config.signUpLocation + '!',
            'pretext': 'New Contact from ' + config.signUpLocation + '! :writing_hand:',
            'color': '#1CCDCD',
            'fields': fields
        }]
    }, config.slackInfo);
    sendMessage(jsonBody, done);
};

SlackService.prototype.simple = (action, text, done) => {
    const config = init(action);

    const jsonBody = _.extend({
        text: text
    }, config.slackInfo);

    sendMessage(jsonBody, done);
};


module.exports = new SlackService();
