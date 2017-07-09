const request = require('request');
const secret = '6LcucCgUAAAAAM0y2UQYJbwEnqOvl3eZVVowRJ-7';

function CaptchaService() {
}

CaptchaService.prototype.verify = (response, remoteip, done) => {
    const jsonBody = {
        secret,
        response,
        remoteip
    };

    const options = {
        method: 'POST',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        form: jsonBody
    };

    request(options, (error, res, body) => {
        if (error) {
            console.error(error);
            done(error);
        } else {
            let isValid = false;
            try {
                const result = JSON.parse(body);
                isValid = result.success;
            } catch (e) {
                // ignore
            }
            done(null, isValid);
        }
    });
};

module.exports = new CaptchaService();
