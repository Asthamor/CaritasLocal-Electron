/* jshint indent: 2 */

bookshelf = require('../js/ipcMain/init-bookshelf');

module.exports = bookshelf.Model.extend({
    tableName: 'cgi_municipio_tbl',
    estado: function() {
        return this.belongsTo(cgi_estados_tbl);
    },
});