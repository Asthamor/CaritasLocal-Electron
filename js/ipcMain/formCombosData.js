/*jshint esversion: 8 */

const {
    ipcMain
} = require("electron");
const path = require('path');
const url = require('url');

var bookshelf = require('./init-bookshelf');

module.exports = {
    ciudadanoFormStates: ipcMain.on('ciudadanoFormGetStates', (event, args) => {
        let model_Estado = require('../../models/cgi_estados_tbl');
        model_Estado.forge({}).fetchAll().then((fetched) => {
                event.sender.send('StatesSent', fetched.toJSON());
        });
    }),

    ciudadanoMunicipios: ipcMain.on('ciudadanoFormGetMunicipio', (event, args) => {
        let model_Municipio = require('../../models/cgi_municipio_tbl');
        model_Municipio.forge({}).where('FKESTADO', args.idState)
        .fetchAll().then((fetched) => {
            event.sender.send('MunicipiosSent', fetched.toJSON());
        });
    }),

    expedienteParentesco: ipcMain.on('expedienteFormGetParentesco', (event, args) => {
        let model_Parentesco = require('../../models/cap_parentesco_tbl');
        model_Parentesco.forge({}).fetchAll().then((fetched) => {
            event.sender.send('parentescosSent', fetched.toJSON());
        });
    }),


    expedienteEscolaridad: ipcMain.on('expedienteFormGetEscolaridad', (event, args) => {
        let model_Escolaridad = require('../../models/cap_escolaridad_tbl');
        model_Escolaridad.forge({}).fetchAll().then((fetched) => {
            event.sender.send('escolaridadesSent', fetched.toJSON());
        });
    }),
    
    expedienteEstadoCivil: ipcMain.on('expedienteFormGetEstadoCivil', (event, args) => {
        let model_EstadoCivil = require('../../models/cap_estado_civil_tbl');
        model_EstadoCivil.forge({}).fetchAll().then((fetched) => {
            event.sender.send('estadoCivilSent', fetched.toJSON());
        });
    }),

    expedienteTecho: ipcMain.on('expedienteFormGetTecho', (event, args) => {
        let model_Techo = require('../../models/cap_techo_tbl');
        model_Techo.forge({}).fetchAll().then((fetched) => {
            event.sender.send('techoSent', fetched.toJSON());
        });
    }),
    expedientePared: ipcMain.on('expedienteFormGetPared', (event, args) => {
        let model_Pared = require('../../models/cap_pared_tbl');
        model_Pared.forge({}).fetchAll().then((fetched) => {
            event.sender.send('paredSent', fetched.toJSON());
        });
    }),
    expedientePosesion: ipcMain.on('expedienteFormGetPosesion', (event, args) => {
        let model_Posesion = require('../../models/cap_posesion_tbl');
        model_Posesion.forge({}).fetchAll().then((fetched) => {
            event.sender.send('posesionSent', fetched.toJSON());
        });
    }),
    expedientePiso: ipcMain.on('expedienteFormGetPiso', (event, args) => {
        let model_Piso = require('../../models/cap_piso_tbl');
        model_Piso.forge({}).fetchAll().then((fetched) => {
            event.sender.send('pisoSent', fetched.toJSON());
        });
    }),

    expedientePiso: ipcMain.on('expedienteFormGetMedio', (event, args) => {
        let model_Medio = require('../../models/cap_medio_tbl');
        model_Medio.forge({}).fetchAll().then((fetched) => {
            event.sender.send('medioSent', fetched.toJSON());
        });
    }),
};