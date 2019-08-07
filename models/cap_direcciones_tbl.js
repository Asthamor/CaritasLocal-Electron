/* jshint indent: 2, esversion: 8*/

bookshelf = require('../js/ipcMain/init-bookshelf');
const Estado = require('./cgi_estados_tbl');
const Municipio = require('./cgi_municipio_tbl')

module.exports = bookshelf.Model.extend({
    tableName: 'cap_direcciones_tbl',
    estado() {
        return this.hasOne(Estado, 'idEstado', 'fkEstado');
    },
    municipio() {
        return this.hasOne(Municipio, 'idMunicipio', 'fkMunicipio');
    },
});