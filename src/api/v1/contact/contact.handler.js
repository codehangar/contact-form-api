var Slack = require('../../../services/slack/slack.service.js');
var Email = require('../../../services/email/email.service.js');
var Segment = require('../../../services/segment/segment.service.js');
var actions = require('../../../data/actions.json');

var handler = function(req, res, next) {
  var payload = req.body;
  console.log('New Capture:');
  console.log(payload);

  var action = actions[req.params.id];

  switch (action.type) {
    case 'contact':
      Email.newContact(action, payload, function(err, msg) {});
      Slack.newContact(action, payload, function(err, msg) {});
      break;
    case 'download':
      Email.newContact(action, payload, function(err, msg) {});
      Slack.downloadCapture(action, payload, function(err, msg) {});

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
  }

  res.status(200).send({
    message: 'Success!'
  });
}

module.exports = handler;
