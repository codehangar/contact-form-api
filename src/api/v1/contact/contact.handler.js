const Slack = require('../../../services/slack.service');
const Email = require('../../../services/email.service');
const Segment = require('../../../services/segment.service');
const Captcha = require('../../../services/captcha.service');
const actions = require('../../../data/actions.json');

const handler = (req, res) => {
    const payload = req.body;
    console.log('New Capture:');
    console.log(payload);
    console.log('From:', req.header('Referer'));
    const action = actions[req.params.id];

    const remoteip = req.header('x-forwarded-for') || req.connection.remoteAddress;

    if (payload['g-recaptcha-response']) {
        Captcha.verify(payload['g-recaptcha-response'], remoteip, (err, isValid) => {
            console.log('Captcha isValid: ', isValid); // eslint-disable-line no-console

            if (isValid) {
                delete payload['g-recaptcha-response'];

                switch (action.type) {
                    case 'contact':
                        Email.newContact(action, payload, () => {
                        });
                        Slack.newContact(action, payload, () => {
                        });
                        if (req.query.autoRespondTemplate) {
                            payload.templateId = req.query.autoRespondTemplate;
                            Email.autoRespond(action, payload, () => null);
                        }
                        break;
                    case 'download':
                        Email.newContact(action, payload, () => {
                        });
                        Slack.downloadCapture(action, payload, () => {
                        });

                        if (payload.segment) {
                            Segment.identify({
                                anonymousId: payload.segment.anonId,
                                userId: payload.email,
                                traits: payload.segment.traits
                            });

                            Segment.track({
                                anonymousId: payload.segment.anonId,
                                userId: payload.email,
                                event: payload.segment.event,
                                properties: payload.segment.properties
                            });
                        }
                        break;
                    default:
                        break;
                }

                return res.status(200).send({
                    message: 'Success!'
                });
            }

            return res.status(404).send();
        });
    } else {
        return res.status(404).send();
    }

    return null;
};

module.exports = handler;
