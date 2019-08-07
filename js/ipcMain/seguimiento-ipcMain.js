/* jshint esversion: 8 */

const {
  ipcMain
}

= require("electron");
const path = require("path");
const url = require("url");

ipcMain.on("getCasosSeguimiento", async (event, args) => {
  const apoyo_Model = require("../../models/cap_apoyos_tbl");
  apoyo_Model.query((qb) => {
    qb.join("cap_casos_tbl", "cap_casos_tbl.idCaso", "cap_apoyos_tbl.fkCaso").where("cap_casos_tbl.estatus", "1").andWhere("cap_apoyos_tbl.estatus", "<>", 2);
  }).fetchAll({
    withRelated: ['caso', 'tipo_Respuesta', 'caso.persona', 'tipo_Apoyo']
  }).then((result) => {
    event.sender.send("TablaSituacionesData", {
      situaciones: result.toJSON(),
    });
  }).catch((error) => {
    console.error(error);
    event.sender.send("TablaSituacionError", {
      error: error,
    });
  });
});