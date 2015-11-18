describe('ContactController Tests', function() {

    var contactController;
    var req;
    var res;
    var next;
    var Slack;
    var Email;

    beforeEach(function() {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        // Mock the Slack service
        Slack = sinon.stub();
        Slack.newContact = sinon.stub();

        // replace the require() module `Slack` with a stub object
        mockery.registerMock('../../../services/slack/slack-service.js', Slack);

        // Mock the Email service
        Email = sinon.stub();
        Email.newContact = sinon.stub();

        // replace the require() module `Email` with a stub object
        mockery.registerMock('../../../services/email/email-service.js', Email);

        // mock the req and res objects
        req = {
            body: 'test'
        };
        res = {
            status: function(code) {
                return {
                    send: function(obj) {}
                }
            }
        };

        sinon.spy(res, "status");

        contactController = require('../../../../../app/controllers/v1/contact/contact-controller');
    });

    describe('post()', function() {

        it('should be a function', function(done) {
            expect(contactController.post).to.be.a('function');
            done();
        });

        it('should call Slack.newContact() one time', function(done) {
            contactController.post(req, res, next);

            expect(Slack.newContact.callCount).to.equal(1);
            done();
        });

        it('should call Slack.newContact() with req.body', function(done) {
            contactController.post(req, res, next);

            expect(Slack.newContact.calledWith(req.body)).to.equal(true);
            done();
        });

        it('should call res.status() one time', function(done) {
            contactController.post(req, res, next);

            expect(res.status.callCount).to.equal(1);
            done();
        });

        it('should call res.status() with 200', function(done) {
            contactController.post(req, res, next);

            expect(res.status.calledWith(200)).to.equal(true);
            done();
        });

    });

    after(function() {
        mockery.disable();
    });
});
