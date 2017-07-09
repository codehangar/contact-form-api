const Analytics = require('analytics-node');
const analytics = new Analytics('78RGOCvUxccFFdR2EIj9wEUGt8qLSPqS');

function Service() {
}

Service.prototype.track = (payload) => {
    analytics.track(payload);
};

Service.prototype.identify = (payload) => {
    console.log('payload', payload);
    analytics.identify(payload);
};

module.exports = new Service();
