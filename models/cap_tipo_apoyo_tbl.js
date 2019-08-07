/* jshint indent: 2 */
const bookshelf = require('../js/ipcMain/init-bookshelf');
module.exports = bookshelf.Model.extend({

    tableName: 'cap_tipo_apoyo_tbl'
});