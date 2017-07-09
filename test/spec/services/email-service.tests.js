describe('EmailService Tests', () => {
    let emailService;
    let postmark;

    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        // Mock the postmark service
        postmark = sinon.stub();
        postmark.Client = sinon.stub();

        // replace the require() module `postmark` with a stub object
        mockery.registerMock('postmark', postmark);

        emailService = require('../../../src/services/email.service');
    });

    describe('newContact', () => {
        it('should be a function', done => {
            expect(emailService.newContact).to.be.a('function');
            done();
        });
    });
});
