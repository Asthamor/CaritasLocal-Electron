/* jshint esversion: 8 */
const {
  ipcMain
} = require("electron");
const path = require("path");
const url = require("url");

ipcMain.on("printDocumentExpediente", async (event, args) => {
  let win = event.sender.getOwnerBrowserWindow();
  win.webContents.print({
    printBackground: true,
  }, (success) => {
    win.close();
  });
});