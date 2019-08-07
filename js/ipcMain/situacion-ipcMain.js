/* jshint esversion: 8 */

const {
  ipcMain
} = require("electron");
const path = require("path");
const url = require("url");
const moment = require("moment");

ipcMain.on("requestSituacionCiudadanoList", async (event, args) => {
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
      event.sender.send("responseSituacionCiudadanoList", result);
    });

});

async function generarFolioSituacion() {
  let casos_Model = require('../../models/cap_casos_tbl');
  let numCaso = await casos_Model.forge({}).orderBy("-idCaso")
    .fetch({}).then((result) => {
      result = result.toJSON();
      return result.idCaso + 1;
    });
  let folio = 'C';
  folio += `${global.centro}`.padStart(3, '0');
  folio += '-FOL';
  folio += `${numCaso}`.padStart(5, '0');
  return folio;
}

async function generarFolioApoyo() {
  let apoyo_Model = require('../../models/cap_apoyos_tbl');
  let apoyoNum = 1;
  await apoyo_Model.forge({}).orderBy('-idApoyo').fetch({})
    .then((result) => {
      result = result.toJSON();
      apoyoNum = result.idApoyo + 1;
    });
  let folio = 'C';
  folio += `${global.centro}`.padStart(3, '0');
  folio += '-AP';
  folio += `${apoyoNum}`.padStart(5, '0');
  return folio;
}

ipcMain.on("GuardarSituacion", (event, args) => {
  const {
    idCaso,
    descripcion,
  } = args;
  let casos_Model = require("../../models/cap_casos_tbl");
  casos_Model.where({
      idCaso: idCaso,
    }).save({
      detalleCaso: descripcion,
      estatus: 1,
    }, {
      method: "update"
    })
    .then(async (caso) => {
      let apoyos_Model = require("../../models/cap_apoyos_tbl");
      await apoyos_Model.where({
        fkCaso: idCaso,
        estatus: 0,
      }).save('estatus', 1, {
        method: "update"
      });

      event.sender.send("SituacionSaved", {
        success: true
      });

    }).catch((e) => {
      console.error(e);
      event.sender.send("SituacionSaveError", {
        success: false
      });
    });

});

ipcMain.on("EliminarSituacion", (event, args) => {
  const bookShelf = require("./init-bookshelf");
  const caso_Model = require("../../models/cap_casos_tbl");
  const apoyo_Model = require("../../models/cap_apoyos_tbl");
  bookShelf.transaction((t) => {
    return apoyo_Model.where({
      fkCaso: args.idCaso
    }).destroy({
      require: false,
      transacting: t
    }).then((result) => {
      return caso_Model.where({
        idCaso: args.idCaso
      }).destroy({
        transacting: t
      });
    });
  }).then((result) => {
    event.sender.send("SituacionDeleted", {
      success: true,
    });
  }).catch((error) => {
    console.error(error);
    event.sender.send("SituacionDeleteError", {
      success: false,
    });
  });
});

ipcMain.on("GenerarFolioCaso", async (event, args) => {
  const {
    codPersona,
  } = args;
  let casos_Model = require("../../models/cap_casos_tbl");
  let casosCount = await casos_Model.where({
    CodPersona: codPersona,
    fkCentro: global.centro,
    estatus: 0,
  }).count();
  if (casosCount == 0) {
    // No exite folio disponible, se debe generar uno.
    folio = await generarFolioSituacion();
    await casos_Model.forge({
      CodPersona: codPersona,
      fkCentro: global.centro,
      folioCaso: folio,
      fechaRegistro: moment().format('YYYY-MM-DD'),
      estatus: 0,
    }).save().then((saved) => {
      saved = saved.toJSON();
      event.sender.send("FolioCreado", {
        folio: folio,
        idCaso: saved.id,
      });
    }).catch((error) => {
      console.error(error);
      event.sender.send('ERRORCrearFolio', {});
    });
  } else {
    // Existe un folio sin usar del ciudadano
    casos_Model.forge({
      CodPersona: codPersona,
      fkCentro: global.centro,
      estatus: 0,
    }).fetch().then(async (result) => {
      result = result.toJSON();
      const apoyo_Model = require("../../models/cap_apoyos_tbl");
      let apoyos;
      await apoyo_Model.where({
        fkCaso: result.idCaso,
      }).fetchAll({
        withRelated: ['tipo_Apoyo', 'frecuencia', 'tipo_Respuesta']
      }).then((result) => {
        apoyos = result.toJSON();
      }).catch((e) => {
        console.error(e);
      });
      event.sender.send("FolioRecuperado", {
        folio: result.folioCaso,
        idCaso: result.idCaso,
        apoyos: apoyos,
      });
    });
  }
});

ipcMain.on("requestCombosSituacion", async (event, args) => {
  let tipoApoyo_Model = require("../../models/cap_tipo_apoyo_tbl");
  let tiposApoyo = await tipoApoyo_Model.forge().fetchAll();
  let frecuenia_Model = require("../../models/cap_frecuencia_tbl");
  let frecuencias = await frecuenia_Model.forge().fetchAll();
  let tipoRespuesta_Model = require("../../models/cap_tipo_respuesta_tbl");
  let tiposRespuesta = await tipoRespuesta_Model.forge().fetchAll();

  event.sender.send("situacionFormDataLoaded", {
    tipoApoyo: tiposApoyo.toJSON(),
    frecuencias: frecuencias.toJSON(),
    tipoRespuesta: tiposRespuesta.toJSON(),
  });
});

ipcMain.on("requestSituacionExpediente", async (event, args) => {
  let expediente_Model = require("../../models/cap_expediente_tbl");
  await expediente_Model
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
      ],
    }).then((fetched) => {
      if (fetched) {
        event.sender.send("expedienteSituacionResponseSent", {
          success: true,
          data: fetched.toJSON(),
        });
      } else {
        event.sender.send("expedienteSituacionNotFoundSent", {
          success: false,
          data: null,
        });
      }
    }).catch((error) => {
      event.sender.send("expedienteSituacionERRORSent", {
        success: false,
        data: null,
        errors: error,
      });
    });
});

ipcMain.on("deleteApoyoRequest", async (event, args) => {
  let apoyo_Model = require("../../models/cap_apoyos_tbl");
  await apoyo_Model.where({
    folioApoyo: args.folio,
  }).destroy().then((success) => {
    event.sender.send("ApoyoDeleted", {
      folioToDelete: args.folio,
    });
  }).catch((e) => {
    console.error(error);
    event.sender.send("ApoyoDeleteError", {});
  });
});

ipcMain.on("NuevoApoyoSubmit", async (event, args) => {
  const {
    idCaso,
    listTipoApoyo,
    FechaInicio,
    FechaFinal,
    listFrecuencia,
    DescripcionApoyo,
    listTipoRespuesta,
    entregado,
    urgente,
  } = args;
  let folio = await generarFolioApoyo(args.idCaso);

  const apoyo_Model = require('../../models/cap_apoyos_tbl');
  await apoyo_Model.forge({
    fkCaso: idCaso,
    folioApoyo: folio,
    fkTipoApoyo: listTipoApoyo,
    fechaInicioA: formatDate(FechaInicio),
    fechaFinA: formatDate(FechaFinal),
    fkFrecuencia: listFrecuencia,
    descripcionApoyo: DescripcionApoyo,
    fkTipoRespuesta: listTipoRespuesta,
    entregado: entregado,
    estatus: entregado == "SI" ? 2 : 0,
    urgente: urgente,
    fechaRegistro: moment().format('YYYY-MM-DD'),
  }).save().then(async (saved) => {
    saved = saved.toJSON();
    const savedWithRelated = await apoyo_Model.forge({
      idApoyo: saved.id,
    }).fetch({
      withRelated: ['tipo_Respuesta', 'tipo_Apoyo', 'frecuencia']
    });
    event.sender.send("apoyoSaved", savedWithRelated.toJSON());
  }).catch((e) => {
    console.error(e);
    event.sender.send("apoyoError", {});
  });
});

//Convierte la fecha de DD/MM/YYYY a formato ISO YYYY-MM-DD
function formatDate(dateString) {
  const [day, month, year] = `${dateString}`.split("/");
  return `${year}-${month}-${day}`;
}