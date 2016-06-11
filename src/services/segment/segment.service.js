var Analytics = require('analytics-node');
var analytics = new Analytics('78RGOCvUxccFFdR2EIj9wEUGt8qLSPqS');

function Service() {}

Service.prototype.track = function(payload) {
  analytics.track(payload);
};

Service.prototype.identify = function(payload) {
  console.log("payload", payload)
  analytics.identify(payload);
};

module.exports = new Service();
