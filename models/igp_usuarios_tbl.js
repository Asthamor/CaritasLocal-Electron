/* jshint indent: 2, esversion: 8*/
const bookshelf = require('../js/ipcMain/init-bookshelf');
const Centro = require('./cap_centros_tbl');
const Noticaias = require('./cap_noticias_tbl');
require('./cap_personas_tbl');

module.exports = bookshelf.model("Usuario", {
    tableName: 'igp_usuarios_tbl',

    acceso() {
        return this.belongsTo(Centro, 'idCentro', 'fkAcceso');
    },
    persona() {
        return this.hasOne('Persona', 'fkUsuario', 'idUsuario');
    },
    noticias() {
        return this.hasMany(Noticias, 'fkUsuario', 'idUsuario');
    },
    permisos() {
        return this.hasMany(Permisos, 'fk_usuario', 'idUsuario');
    },

});