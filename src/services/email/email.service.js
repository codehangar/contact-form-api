var postmark = require("postmark");
var client = new postmark.Client(process.env.POSTMARK_TOKEN);
var _ = require('lodash');

function EmailService() {}

EmailService.prototype.newContact = function(action, payload, done) {

    var templateModel = _.extend({
        "name": payload.name,
        "email": payload.email,
        "message": payload.message
    }, action.postmark.templateModel);

    var toAddress = payload.email;
    if (action.postmark.to) {
        toAddress = action.postmark.to;
    }

    client.sendEmailWithTemplate({
        "From": action.postmark.from,
        "To": toAddress,
        "Cc": action.postmark.cc,
        "Bcc": action.postmark.bcc,
        "TemplateId": action.postmark.templateId,
        "TemplateModel": templateModel
    }, function(error, success) {
        if (error) {
            console.error("Unable to send Contact email for " + payload.email + " via postmark: " + error.message);
            done(error);
        } else {
            console.info("Contact email for " + payload.email + " Sent to postmark for delivery");
            done(null, "Contact email for " + payload.email + " Sent to postmark for delivery");
        }
    });
};

module.exports = new EmailService();
