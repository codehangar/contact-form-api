describe('EmailService Tests', function() {

    var emailService;

    beforeEach(function() {

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

        emailService = require('../../../../app/services/email/email-service');
    });

    describe('newContact', function() {

        it('should be a function', function(done) {
            expect(emailService.newContact).to.be.a('function');
            done();
        });

    });
});
