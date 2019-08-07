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


describe('Application launch', function() {
    this.timeout(10000);

    beforeEach(function() {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    afterEach(function() {
        return app.stop();

    });


    it('opens a window', function() {
        return app.client.waitUntilWindowLoaded()
            .getWindowCount().should.eventually.have.at.least(1)
            .browserWindow.isMinimized().should.eventually.be.false
            .browserWindow.isVisible().should.eventually.be.true
            .browserWindow.isFocused().should.eventually.be.true
            .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
            .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0);
    });
});