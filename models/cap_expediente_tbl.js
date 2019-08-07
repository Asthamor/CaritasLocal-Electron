/* jshint indent: 2, esversion: 8*/
const bookshelf = require('../js/ipcMain/init-bookshelf');
require('./cap_personas_tbl');

const EstadoCivil = require('./cap_estado_civil_tbl');
const Techo = require('./cap_techo_tbl');
const Pared = require('./cap_pared_tbl');
const Piso = require('./cap_piso_tbl');
const Posesion = require('./cap_posesion_tbl');
const Medio = require('./cap_medio_tbl');

module.exports = bookshelf.model('Expediente', {
    tableName: 'cap_expediente_tbl',
    persona() {
        return this.belongsTo('Persona', 'codPersona', 'codPersona');
    },
    estadoCivil() {
        return this.hasOne(EstadoCivil, 'idEstadoCivil', 'fkEstadoCivil');
    },
    techo() {
        return this.hasOne(Techo, 'idtecho', 'fkTecho');
    },
    pared() {
        return this.hasOne(Pared, 'idPared', 'fkPared');
    },
    piso() {
        return this.hasOne(Piso, 'idpiso', 'fkPiso');
    },
    posesion() {
        return this.hasOne(Posesion, 'idPosesion', 'fkPosesion');
    },
    medio() {
        return this.hasOne(Medio, 'idMedio', 'fkmedio');
    },
});