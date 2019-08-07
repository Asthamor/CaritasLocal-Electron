/* jshint indent: 2 */

bookshelf = require('../js/ipcMain/init-bookshelf');

module.exports = bookshelf.Model.extend({
    tableName: "cgi_estados_tbl",
});