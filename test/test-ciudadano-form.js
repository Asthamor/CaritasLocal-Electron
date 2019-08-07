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


describe("NewCiudadano Form Test", function() {
    this.timeout(10000);

    before(function() {
        chaiAsPromised.transferPromiseness = app.transferPromiseness;
        return app.start();
    });

    after(function() {
        return app.stop();
    });

    after(function() {
        app.mainProcess.exit(1);
    })

    it('gets to new ciudadano form', function() {
        return app.client
            .setValue('#name', 'Andrea')
            .setValue('#password', '123456')
            .element('#LoginButton').click()
            .waitUntilTextExists('a', 'Apoyo a Beneficiarios 1.0')
            .element('#main-section')
            .should.eventually.exist
            .element('#NuevoCiudadano').click()
            .element('#FormNuevoCiudadano').should.eventually.exist;
    });

    it('rejects blank submit', function() {
        return app.client
            .element('#btnGuardarCiudadano').getAttribute('class')
            .should.eventually.contain('disabled');
    });

    it('shows required field hints', function() {
        return app.client
            .element('#btnGuardarCiudadano').click()
            .waitUntilTextExists('div', 'Requerido');
    });

    it('submits a valid new ciudadano', function() {
        return app.client
            .setValue('#nombre', 'Mauricio')
            .setValue('#paterno', 'Torres')
            .setValue('#materno', 'Osorio')
            .element('#listSexo > option:nth-child(1)').click()
            .element('#fechaNacimiento').click()
            .element('.dtp-actual-year').isVisible().should.eventually.be.true
            .element('.dtp-select-year-before').isVisible().should.eventually.be.true
            .element('.dtp-select-year-before').click()
            .click().click().click().click().click().click().click().click().click().click()
            .element('dtp-buttons button*=Aceptar')
            .setValue('#curp', 'TOOM920210HVZRSR05')
            .setValue('#ine', '1231231231233')
            .setValue('#rfc', 'TOOM920210N77')
            .setValue('#calle', 'Cipres')
            .setValue('#no', '16')
            .setValue('#colonia', 'Los Pinos')
            .element('#listEstado > option:nth-child(20)').click()
            .element('#listMunicipio > option:nth-child(4)').click()
            .setValue('#cp', '91026')
            .setValue('#telefono', '8159144')
            .setValue('#celular', '2281215150')
            .setValue('#correo', 'mauricio.torres.osorio@gmail.com')
            .element('#btnGuardarCiudadano').click();

    });

    it('submits a valid ciudadano with required fields', function() {});


    it('rejects a duplicate ciudadano submit', function() {});
});