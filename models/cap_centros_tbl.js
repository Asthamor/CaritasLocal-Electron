/* jshint indent: 2, esversion: 8*/
const bookshelf = require('../js/ipcMain/init-bookshelf');
const Persona = require('./cap_personas_tbl');
const Caso = require('./cap_casos_tbl');
const Apoyo = require('./cap_apoyos_tbl');

module.exports = bookshelf.Model.extend({
    tableName: 'cap_centros_tbl',
    persona() {
        return this.hasMany(Persona, 'idCentro', 'fkCentro');
    },
    caso() {
        return this.hasMany(Caso, 'fkCentro', 'idCentro');
    },
});