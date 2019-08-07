/* eslint-env node, mocha */
var Application = require('spectron').Application;
var chai = require('chai');
var should = chai.should();
var chaiAsPromised = require('chai-as-promised');
var assert = require('assert');
var electronPath = require('electron');
var path = require('path');


if (process.platform === 'win32') {
    electronPath += '.cmd';
}

var appPath = path.join(__dirname, '..');

var app = new Application({
    path: electronPath,
    args: [appPath],
    env: {
        ELECTRON_ENABLE_LOGGING: true,
        ELECTRON_ENABLE_STACK_DUMPING: true,
        NODE_ENV: "development"
    },
    startTimeout: 20000,
});


global.before(function() {
    chai.should();
    chai.use(chaiAsPromised);
});


describe("User's Login", function() {
    this.timeout(10000);

    before(function() {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    after(function() {
        return app.stop();
    });

    it('opens main window', function() {
        return app.client.waitUntilWindowLoaded().getWindowCount().should.eventually.equal(1);
    });

    it("loads initial form", function() {
        return app.client
            .getText('#name').should.eventually.equal('')
            .getText('#password').should.eventually.equal('');
    });
    it("fill out form", function() {
        return app.client
            .setValue('#name', 'Andrea')
            .setValue('#password', '123456')
            .element('#LoginButton').isEnabled().should.eventually.equal(true)
    });
    it('blocks incorrect login', function() {
        return app.client.setValue('#name', 'testuser')
            .setValue('#password', 'notpass')
            .element('#LoginButton').click()
            .element('#myModal').isVisible().should.eventually.be.true
            .element('button*=Cerrar').click();
    });
    it('accepts correct login', function() {
        return app.client
            .setValue('#name', 'Andrea')
            .setValue('#password', '123456')
            .element('#LoginButton').click()
            .waitUntilTextExists('a', 'Apoyo a Beneficiarios 1.0')
            .element('#main-section')
            .should.eventually.exist;
    });

    after(function() {
        app.mainProcess.exit(1);
    })
});