/* jshint indent: 2 */

bookshelf = require('../js/ipcMain/init-bookshelf');

module.exports = bookshelf.Model.extend({
    tableName: "cap_escolaridad_tbl",
});