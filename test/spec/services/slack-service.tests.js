describe('SlackService Tests', () => {
    let slackService;

    beforeEach(() => {
        slackService = require('../../../src/services/slack.service');
    });

    describe('newContact', () => {
        it('should be a function', done => {
            expect(slackService.newContact).to.be.a('function');
            done();
        });
    });

    describe('simple', () => {
        it('should be a function', done => {
            expect(slackService.simple).to.be.a('function');
            done();
        });
    });
});
