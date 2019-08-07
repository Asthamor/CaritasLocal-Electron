/* jshint indent: 2 */

bookshelf = require('../js/ipcMain/init-bookshelf');

module.exports = bookshelf.Model.extend({
    tableName: 'cap_parentesco_tbl',
    datosFamiliar: function() {
        return this.belongsTo(cap_datos_familiares_tbl)
    }
});