describe('SlackService Tests', function() {

    var slackService;

    beforeEach(function() {
        slackService = require('../../../../src/services/slack/slack-service');
    });

    describe('newContact', function() {

        it('should be a function', function(done) {
            expect(slackService.newContact).to.be.a('function');
            done();
        });

    });

    describe('simple', function() {

        it('should be a function', function(done) {
            expect(slackService.simple).to.be.a('function');
            done();
        });

    });
});
