/* jshint esversion: 8 */

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


function getlength(number) {
    return number.toString().length;
}

async function nuevoCodigoPersona(idCentro) {
    return await Promise.resolve(await knex('cap_personas_tbl')
        .where('fkCentro', idCentro)
        .then(async (resp) => {
            let numPersona = resp.length + 1;
            let codigoPersona = 'C';
            codigoPersona += `${idCentro}`.padStart(3, '0');
            codigoPersona += '-';
            codigoPersona += `${numPersona}`.padStart(3, '0');
            return codigoPersona;
        })
    );
}

async function checkPersonaExists({
    rfc,
    curp,
    ine,
    name,
    paterno,
    materno,
    fechaNacimiento,
}) {
    var userexists = false;
    var errors = [];
    response = '';
    if (rfc || curp || ine) {
        await Promise.resolve(await knex('cap_personas_tbl')
            .where('curp', curp)
            .orWhere('ife', ine)
            .orWhere('rfc', rfc)
            .then((rows) => {
                if (rows) {
                    userexists = true;
                    errors = [...errors, 'CURP/RFC/INE Existe'];
                }
            }));
    } else {
        await Promise.resolve(await knex('cap_personas_tbl')
            .where({
                nombrePersona: name,
                paternoPersona: paterno,
                maternoPersona: materno,
                fechaNacimientoP: fechaNacimiento,
            }).then((rows) => {
                if (rows.length > 0) {
                    userexists = true;
                    errors = [...errors, 'Nombre y fecha de   coinciden con un registro'];
                }
            }));
    }
    response = {
        exists: userexists,
        errors: errors,
    };
    return response;
}


ipcMain.on('NewCiudadanoSubmit', async (event, args) => {
    let IDCentro = global.centro;
    let success = false;
    let existsResponse = await checkPersonaExists(args);
    let errors = existsResponse.errors;
    let codigoPersona = await nuevoCodigoPersona(IDCentro);

    const ine = args.ine == '' ? null : args.ine;
    const rfc = args.rfc == '' ? null : args.rfc;
    const curp = args.curp == '' ? null : args.curp;

    const {
        name,
        paterno,
        materno,
        listSexo,
        fechaNacimiento,
        edad,
        calle,
        numero,
        colonia,
        codigoPostal,
        estado,
        municipio,
        telefono,
        celular,
        correo
    } = args;


    if (!existsResponse.exists) {
        await Promise.resolve(await knex.transaction((trx) => {
            return knex('cap_personas_tbl')
                .transacting(trx)
                .insert(
                    [{
                        codPersona: codigoPersona,
                        nombrePersona: name,
                        paternoPersona: paterno,
                        maternoPersona: materno,
                        sexo: listSexo,
                        fechaNacimientoP: fechaNacimiento,
                        edad: edad,
                        curp: curp,
                        ife: ine,
                        rfc: rfc,
                        estatus: 1,
                        fkCentro: IDCentro,
                        fkUsuario: 1,
                    }], ['idPersona']
                ).then((resp) => {
                    return knex('cap_direcciones_tbl ')
                        .transacting(trx)
                        .insert([{
                            CodPersona: codigoPersona,
                            calle: calle,
                            no: numero,
                            colonia: colonia,
                            cp: codigoPostal,
                            fkEstado: estado,
                            fkMunicipio: municipio,
                            estatus: 1,
                            fechaRegistro: new Date().toISOString().slice(0, 10),
                        }], ['idDireccion']).then((resp) => {
                            return knex('cap_contactos_tbl')
                                .transacting(trx)
                                .insert([{
                                    codPersona: codigoPersona,
                                    telefono: telefono,
                                    celular: celular,
                                    correo: correo,
                                    fechaRegistro: new Date().toISOString().slice(0, 10),
                                    estatus: 1,
                                }], ['idContacto']);
                        });
                }).then(() => {
                    trx.commit;
                    success = true;
                })
                .catch(trx.rollback);
        }).then(() => {}).catch((error) => {
            console.error(error);
            errors = [...errors, 'Error de insercion'];
        }));


    } else {
        errors = [...errors, 'La persona que intenta insertar ya existe'];
    }
    response = {
            errors: errors,
            success: success,
            folio: codigoPersona,
        },

        event.sender.send('CiudadanoSubmitted', response);
});