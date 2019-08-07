/*jshint esversion: 6 */

const {
    ipcMain
} = require("electron");
const path = require('path');
const url = require('url');

var knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: path.join(__dirname, '../../caritas.db')
    },
    useNullAsDefault: true,

});

module.exports = ipcMain.on('UserValidation', (event, args) => {
    errorMessage = 'Usuario o contraseña es incorrecta favor de intenter nuevamente';
    successMessage = 'Bienvenido';
    currentDate = new Date();
    response = '';
    userStatus = 1;
    result = knex("igp_usuarios_tbl").select('idusuario', 'caducidad', 'fkAcceso', 'fkTipoAcceso')
        .where({
            usuario: args.username,
            password: args.password,
            estatus: 1
        }).first();

    result.then((rows) => {
        if (rows) {
            if (result.caducidad < currentDate) {
                response = {
                    userStatus: 0,
                    errorMessage: "Usuario bloqueado"
                };
            } else {
                global.username = args.username;
                global.centro = rows.fkAcceso;
                global.tipoAcceso = rows.fkTipoAcceso;
                global.idUsuario = rows.idUsuario;
                response = {
                    username: args.username,
                    acceso: rows.fkAcceso,
                    tipoAcceso: rows.fkTipoAcceso,
                    userStatus: "Valid",
                    errorMessage: "Bienvenido",
                };
            }
        } else {
            response = {
                userStatus: 0,
                errorMessage: errorMessage,
            };
        }
        event.sender.send('LoginResponse', response);
    });

});