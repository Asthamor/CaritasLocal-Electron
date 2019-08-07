/* jshint esversion: 8 */

const {
    ipcMain
} = require("electron");
const path = require("path");
const url = require("url");
let Bookshelf = require("./init-bookshelf");

ipcMain.on("requestExpediente", (event, args) => {
    let expediente_Model = require("../../models/cap_expediente_tbl");
    expediente_Model
        .forge({
            codPersona: `${args.codPersona}`,
        })
        .fetch({
            withRelated: [
                'estadoCivil', 'techo', 'pared', 'piso', 'posesion', 'medio',
                'persona', 'persona.datosFamiliares', 'persona.datosFamiliares.escolaridad',
                'persona.datosFamiliares.parentesco', 'persona.direccion',
                'persona.direccion.municipio', 'persona.direccion.estado',
                'persona.contacto'
            ]
        }).then((fetched) => {
            if (fetched) {
                event.sender.send("expedienteResponseSent", {
                    success: true,
                    data: fetched.toJSON(),
                });
            } else {
                let persona_Model = require("../../models/cap_personas_tbl");
                persona_Model.forge({
                    codPersona: `${args.codPersona}`,
                }).fetch({
                    withRelated: [
                        'datosFamiliares', 'datosFamiliares.escolaridad',
                        'datosFamiliares.parentesco', 'direccion',
                        'direccion.municipio', 'direccion.estado',
                        'contacto',
                    ]
                }).then((personaFetched) => {
                    event.sender.send("newExpedienteResponseSent", {
                        success: true,
                        data: {
                            persona: personaFetched.toJSON(),
                        },
                    });
                }).catch((error) => {
                    event.sender.send("expedienteResponseSent", {
                        success: false,
                        data: null,
                        errors: error,
                    });
                });
            }
        }).catch((error) => {
            event.sender.send("expedienteResponseSent", {
                success: false,
                data: null,
                errors: error,
            });
        });
});

ipcMain.on("requestExpedientePrint", (event, args) => {
    let expediente_Model = require("../../models/cap_expediente_tbl");
    expediente_Model
        .forge({
            codPersona: `${args.codPersona}`,
        })
        .fetch({
            withRelated: [
                'estadoCivil', 'techo', 'pared', 'piso', 'posesion', 'medio',
                'persona', 'persona.datosFamiliares', 'persona.datosFamiliares.escolaridad',
                'persona.datosFamiliares.parentesco', 'persona.direccion',
                'persona.direccion.municipio', 'persona.direccion.estado',
                'persona.contacto'
            ]
        }).then((fetched) => {
            if (fetched) {
                event.sender.send("expedientePrintResponseSent", {
                    success: true,
                    data: fetched.toJSON(),
                });
            } else {
                let persona_Model = require("../../models/cap_personas_tbl");
                persona_Model.forge({
                    codPersona: `${args.codPersona}`,
                }).fetch({
                    withRelated: [
                        'datosFamiliares', 'datosFamiliares.escolaridad',
                        'datosFamiliares.parentesco', 'direccion',
                        'direccion.municipio', 'direccion.estado',
                        'contacto',
                    ]
                }).then((personaFetched) => {
                    event.sender.send("noExpedientePrintResponseSent", {
                        success: true,
                        data: {
                            persona: personaFetched.toJSON(),
                        },
                    });
                }).catch((error) => {
                    event.sender.send("expedientePrintResponseERROR", {
                        success: false,
                        data: null,
                        errors: error,
                    });
                });
            }
        }).catch((error) => {
            event.sender.send("expedientePrintResponseERROR", {
                success: false,
                data: null,
                errors: error,
            });
        });
});

ipcMain.on("requestCiudadanoList", async (event, args) => {
    let ciudadano_Model = require("../../models/cap_personas_tbl");
    ciudadano_Model
        .forge({})
        .fetchAll()
        .then((fetched) => {
            result = fetched.toJSON();
            result.forEach((element, index) => {
                result[index].nombreCompleto = `${result[index].nombrePersona} ${
          result[index].paternoPersona
        } ${result[index].maternoPersona}`;
            });
            event.sender.send("responseCiudadanoList", result);
        });

});

ipcMain.on("addFamiliarRequest", (event, args) => {
    let familiar = JSON.parse(args);
    let familiar_Model = require("../../models/cap_datos_familiares_tbl");
    let ingresosFijos = 0;
    if (familiar.ingresosFijos === "on") {
        ingresosFijos = 1;
    } else {
        ingresosFijos = 0;
    }
    familiar_Model.forge({
        codPersona: familiar.codPersona,
        fkParentesco: familiar.listParentesco,
        nombreCompleto: familiar.nombreFamiliar,
        edad: familiar.edadFamiliar,
        ocupacion: familiar.ocupacionFamiliar,
        fkEscolaridad: familiar.listEscolaridad,
        ingresosMensuales: familiar.ingresosFamiliares,
        ingresosFijos: ingresosFijos,
        observacion: familiar.observacionFamiliar,
    }).save().then((result) => {
        familiar_Model.forge({
            idDatosFamiliares: result.id,
        }).fetch({
            withRelated: [
                'parentesco', 'escolaridad'
            ]
        }).then((fetched) => {
            event.sender.send("familiarAddedSuccess", {
                result: fetched.toJSON(),
            });
        }).catch((error) => {
            console.error(error);
        });
    }).catch((error) => {
        event.sender.send("ERRORFamiliarAdd", {
            error: JSON.stringify(error),
        });
    });
});

ipcMain.on("deleteFamiliarRequest", (event, args) => {
    let familiar_Model = require("../../models/cap_datos_familiares_tbl");
    familiar_Model.forge({}).where({
        codPersona: args.codPersona,
        nombreCompleto: args.nombre,
        edad: args.edad,
        ocupacion: args.ocupacion,
        ingresosMensuales: args.ingresos,
        observacion: args.observacion,
    }).destroy().then((result) => {
        event.sender.send("familiarRemoveSuccess", {
            result: result.toJSON(),
            deletedRow: args.rowToDelete[0][0],
        });
    }).catch((error) => {
        console.error(error);
        event.sender.send("ERRORFamiliarRemove", {
            error: error
        });
    });
});

ipcMain.on("submitExpedienteData", (event, args) => {
    let expediente = JSON.parse(args);
    let expediente_Model = require("../../models/cap_expediente_tbl");
    if (expediente.idExpediente) {
        expediente_Model.forge({
            codPersona: expediente.codPersona,
            asistenciaMedica: expediente.Amedica,
            fkEstadoCivil: expediente.listEstadoCivil,
            ocupacion: expediente.ocupacion,
            ingresosMensuales: expediente.ingresos,
            fkTecho: expediente.listTecho,
            fkPared: expediente.listPared,
            fkPiso: expediente.listPiso,
            fkPosesion: expediente.listPosesion,
            noCuartos: expediente.cuartos,
            pagaRenta: expediente.PagaRenta,
            pagoRenta: expediente.PagaRentaCuanto,
            visitaDomiciliar: expediente.Visita,
            descripcionVisita: expediente.disitaDetalle,
            observacionesVisita: expediente.obervacionesvivienda,
            informante: expediente.informante,
            fkmedio: expediente.listMedio,
            nombreMedio: expediente.nombreMedio,
            nombreInformante: expediente.nombreInformante,
            telefonoInformante: expediente.telefonoInformante,
            ayudaAnterior: expediente.ayudaAnterior,
            descripcionAyuda: expediente.descripcionAyuda,
        }).where({
            idExpediente: expediente.idExpediente,
        }).save(null, {
            method: 'update'
        }).then((saved) => {}).catch((error) => {
            console.error(error);
        });
    } else {
        expediente_Model.forge({
            codPersona: expediente.codPersona,
            asistenciaMedica: expediente.Amedica,
            fkEstadoCivil: expediente.listEstadoCivil,
            ocupacion: expediente.ocupacion,
            ingresosMensuales: expediente.ingresos,
            fkTecho: expediente.listTecho,
            fkPared: expediente.listPared,
            fkPiso: expediente.listPiso,
            fkPosesion: expediente.listPosesion,
            noCuartos: expediente.cuartos,
            pagaRenta: expediente.PagaRenta,
            pagoRenta: expediente.PagaRentaCuanto,
            visitaDomiciliar: expediente.Visita,
            descripcionVisita: expediente.disitaDetalle,
            observacionesVisita: expediente.obervacionesvivienda,
            informante: expediente.informante,
            fkmedio: expediente.listMedio,
            nombreMedio: expediente.nombreMedio,
            nombreInformante: expediente.nombreInformante,
            telefonoInformante: expediente.telefonoInformante,
            ayudaAnterior: expediente.ayudaAnterior,
            descripcionAyuda: expediente.descripcionAyuda,
        }).save(null, {
            method: 'insert'
        }).then((saved) => {}).catch((error) => {
            console.error(error);
        });
    }
});