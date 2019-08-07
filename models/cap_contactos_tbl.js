/* jshint indent: 2 */
bookshelf = require('../js/ipcMain/init-bookshelf');

module.exports = bookshelf.model('Contacto', {
    tableName: 'cap_contactos_tbl',
});