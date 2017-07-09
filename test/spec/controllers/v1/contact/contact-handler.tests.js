const actions = require('../../../../../src/data/actions.json');
const slackAction = actions['codehangar-contact-form'];

describe('ContactHandler Tests', () => {
    let contactHandler;
    let req;
    let res;
    let Slack;
    let Email;

    beforeEach(() => {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        // Mock the Slack service
        Slack = sinon.stub();
        Slack.newContact = sinon.stub();

        // replace the require() module `Slack` with a stub object
        mockery.registerMock('../../../services/slack.service', Slack);

        // Mock the Email service
        Email = sinon.stub();
        Email.newContact = sinon.stub();

        // replace the require() module `Email` with a stub object
        mockery.registerMock('../../../services/email.service', Email);

        // mock the req and res objects
        req = {
            body: 'test',
            header: sinon.stub().returns('tester'),
            params: {
                id: 'codehangar-contact-form'
            },
            connection: {remoteAddress: ''}
        };
        res = {
            status: () => ({
                send: () => {
                }
            })
        };

        sinon.spy(res, 'status');

        contactHandler = require('../../../../../src/api/v1/contact/contact.handler');
    });

    describe('contactHandler()', () => {
        it('should be a function', () => {
            expect(contactHandler).to.be.a('function');
        });

        it('should call Slack.newContact() one time', () => {
            contactHandler(req, res);
            expect(Slack.newContact.callCount).to.equal(1);
        });

        it('should call Slack.newContact() with req.body', () => {
            contactHandler(req, res);
            expect(Slack.newContact.calledWith(slackAction, 'test')).to.equal(true);
        });

        it('should call res.status() one time', () => {
            contactHandler(req, res);
            expect(res.status.callCount).to.equal(1);
        });

        it('should call res.status() with 200', () => {
            contactHandler(req, res);
            expect(res.status.calledWith(200)).to.equal(true);
        });
    });

    after(() => {
        mockery.disable();
    });
});
