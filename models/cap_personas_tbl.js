/* jshint indent: 2, esversion: 8 */

const bookshelf = require('../js/ipcMain/init-bookshelf');
const Centro = require('./cap_centros_tbl');
require('./cap_expediente_tbl');
const Familiares = require('./cap_datos_familiares_tbl');
const Direccion = require('./cap_direcciones_tbl');
const Contacto = require('./cap_contactos_tbl');


module.exports = bookshelf.model('Persona', {
    tableName: 'cap_personas_tbl',
    centro() {
        return this.belongsTo(Centro, 'idCentro', 'fkCentro');
    },
    expediente() {
        return this.hasOne('Expediente', 'codPersona', 'codPersona');
    },
    datosFamiliares() {
        return this.hasMany(Familiares, 'codPersona', 'codPersona');
    },
    contacto() {
        return this.hasOne(Contacto, 'CodPersona', 'codPersona');
    },
    direccion() {
        return this.hasOne(Direccion, 'CodPersona', 'codPersona');
    },
});