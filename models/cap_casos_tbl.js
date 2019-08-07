/* jshint indent: 2, esversion: 8*/

const bookshelf = require('../js/ipcMain/init-bookshelf');
const Persona = require('./cap_personas_tbl');
const Centro = require('./cap_centros_tbl');
const Apoyo = require('./cap_apoyos_tbl');



module.exports = bookshelf.model("Caso", {
    tableName: 'cap_casos_tbl',
    persona() {
        return this.belongsTo("Persona", 'CodPersona', 'codPersona');
    },
    centro() {
        return this.belongsTo(Centro, 'fkCentro', 'idCentro');
    },
    apoyo() {
        return this.hasMany(Apoyo, 'fkCaso', 'idCaso');
    }
});