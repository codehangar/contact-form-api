function EmailService() {
    var postmark = require("postmark");
    var client = new postmark.Client(process.env.POSTMARK_TOKEN);

    function newContact(contact, done) {
        client.sendEmailWithTemplate({
            "From": process.env.POSTMARK_FROM,
            "To": process.env.POSTMARK_TO,
            "TemplateId": process.env.POSTMARK_TEMPLATE_ID,
            "TemplateModel": {
                "name": contact.name,
                "email": contact.email,
                "message": contact.message
            }
        }, function(error, success) {
            if (error) {
                console.error("Unable to send Contact email for " + contact.email + " via postmark: " + error.message);
                done(error);
            } else {
                console.info("Contact email for " + contact.email + " Sent to postmark for delivery");
                done(null, "Contact email for " + contact.email + " Sent to postmark for delivery");
            }
        });
    }

    this.newContact = newContact;
}

module.exports = new EmailService();
