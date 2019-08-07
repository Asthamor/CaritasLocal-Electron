/* jshint indent: 2 */
const bookshelf = require('../js/ipcMain/init-bookshelf');


module.exports = bookshelf.model('Frecuencia', {
    tableName: 'cap_frecuencia_tbl'
});