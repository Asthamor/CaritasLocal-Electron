/* jshint indent: 2, esversion: 8 */

bookshelf = require('../js/ipcMain/init-bookshelf');
const Parentesco = require('./cap_parentesco_tbl');
const Escolaridad = require('./cap_escolaridad_tbl');

module.exports = bookshelf.Model.extend({
    tableName: 'cap_datos_familiares_tbl',
    parentesco() {
        return this.hasOne(Parentesco, 'idParentesco', 'fkParentesco');
    },
    escolaridad() {
        return this.hasOne(Escolaridad, 'idEscolaridad', 'fkEscolaridad');
    },
});