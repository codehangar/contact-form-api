const actions = require('../../../../../src/data/actions.json');
const contactFormAction = actions['codehangar-contact-form'];

describe('ContactHandler Tests', () => {
    let contactHandler;
    let reqInvalid;
    let reqValid;
    let res;
    let Slack;
    let Email;
    let Captcha;

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
        Email.autoRespond = sinon.stub();

        // replace the require() module `Email` with a stub object
        mockery.registerMock('../../../services/email.service', Email);

        // Mock the Captcha service
        Captcha = sinon.stub();
        Captcha.verify = (recaptchaResponse, remoteip, callback) => {
            callback(null, true);
        };

        // replace the require() module `Email` with a stub object
        mockery.registerMock('../../../services/captcha.service', Captcha);

        // mock the req and res objects
        reqInvalid = {
            body: 'test',
            header: sinon.stub().returns('tester'),
            params: {
                id: 'codehangar-contact-form'
            },
            connection: {remoteAddress: ''},
            query: {}
        };
        reqValid = {
            body: {
                'name': 'Joe FormFiller',
                'g-recaptcha-response': 'something'
            },
            header: sinon.stub().returns('tester'),
            params: {
                id: 'codehangar-contact-form'
            },
            connection: {remoteAddress: ''},
            query: {}
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
            contactHandler(reqValid, res);
            expect(Slack.newContact.callCount).to.equal(1);
        });

        it('should call Slack.newContact() with req.body', () => {
            contactHandler(reqValid, res);
            expect(Slack.newContact.args[0][0]).to.deep.equal(contactFormAction);
            expect(Slack.newContact.args[0][1]).to.deep.equal({'name': 'Joe FormFiller'});
        });

        it('should call res.status() one time with valid request', () => {
            contactHandler(reqValid, res);
            expect(res.status.callCount).to.equal(1);
        });

        it('should call res.status() with 200', () => {
            contactHandler(reqValid, res);
            expect(res.status.args[0][0]).to.equal(200);
        });

        it('should call Email.newContact() with req.body', () => {
            contactHandler(reqValid, res);
            expect(Email.newContact.args[0][0]).to.deep.equal(contactFormAction);
            expect(Email.newContact.args[0][1]).to.deep.equal({'name': 'Joe FormFiller'});
        });

        it('should NOT call Email.autoRespond() with no template id given', () => {
            contactHandler(reqValid, res);
            expect(Email.autoRespond.callCount).to.equal(0);
        });

        it('should call Email.autoRespond() with template if template id is given', () => {
            const req1 = Object.assign({}, reqValid, {query: {autoRespondTemplate: '1234'}});
            contactHandler(req1, res);

            expect(Email.newContact.args[0][0]).to.deep.equal(contactFormAction);
            expect(Email.newContact.args[0][1]).to.deep.equal({
                templateId: '1234',
                name: 'Joe FormFiller'
            });
        });

        it('should call res.status() one time with invalid request', () => {
            contactHandler(reqValid, res);
            expect(res.status.callCount).to.equal(1);
        });

        it('should call res.status() with 404 if captcha response is not provided', () => {
            contactHandler(reqInvalid, res);
            expect(res.status.args[0][0]).to.equal(404);
        });
    });

    after(() => {
        mockery.disable();
    });
});
