/* jshint indent: 2, esversion: 6 */

const bookshelf = require('../js/ipcMain/init-bookshelf');
const Frecuencia = require('./cap_frecuencia_tbl');
const TipoApoyo = require('./cap_tipo_apoyo_tbl');
const Caso = require('./cap_casos_tbl');
const TipoRespuesta = require('./cap_tipo_respuesta_tbl');

module.exports = bookshelf.model("Apoyo", {
    tableName: 'cap_apoyos_tbl',
    frecuencia() {
        return this.hasOne(Frecuencia, 'idFrecuencia', 'fkFrecuencia');
    },
    tipo_Apoyo() {
        return this.hasOne(TipoApoyo, 'idTipoApoyo', 'fkTipoApoyo');
    },
    caso() {
        return this.belongsTo("Caso", 'fkCaso', 'idCaso');
    },
    tipo_Respuesta() {
        return this.hasOne(TipoRespuesta, 'idTipoRespuesta',
            'fkTipoRespuesta');
    },

});