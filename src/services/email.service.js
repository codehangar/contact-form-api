const postmark = require('postmark');
const _ = require('lodash');
const client = new postmark.Client(process.env.POSTMARK_TOKEN);

function EmailService() {
}

EmailService.prototype.newContact = (action, payload, done) => {
    const templateModel = _.extend(payload, action.postmark.templateModel);

    let toAddress = payload.email;
    if (action.postmark.to) {
        toAddress = action.postmark.to;
    }

    client.sendEmailWithTemplate({
        'From': action.postmark.from,
        'To': toAddress,
        'Cc': action.postmark.cc,
        'Bcc': action.postmark.bcc,
        'TemplateId': action.postmark.templateId,
        'TemplateModel': templateModel
    }, (error, success) => {
        if (error) {
            console.error('Unable to send Contact email for ' + payload.email + ' via postmark: ' + error.message);
            done(error);
        } else {
            console.log('success', success); // eslint-disable-line no-console
            console.info('Contact email for ' + payload.email + ' Sent to postmark for delivery');
            done(null, 'Contact email for ' + payload.email + ' Sent to postmark for delivery');
        }
    });
};

module.exports = new EmailService();
