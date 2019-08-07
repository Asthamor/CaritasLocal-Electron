/*jshint esversion: 6 */

const {
    app,
    BrowserWindow,
    ipcMain
} = require("electron");
const path = require("path");
const url = require("url");
loggued_user = "";

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1024,
        height: 766,
        titleBarStyle: "hidden",
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, "index.html"),
            protocol: "file",
            slashes: true
        })
    );

    // Open the DevTools.
    //win.webContents.openDevTools();

    win.once("ready-to-show", () => {
        mainWindow.show();
    });

    ipcMain.on("loadMainMenu", (event, arg) => {
        mainMenuURL = path.join("file://", __dirname, "/html/mainMenu.html");
        win.loadURL(mainMenuURL);

        //win.webContents.send("resultSent", rows);
    });

    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//database ORM initialization
require("./js/ipcMain/init-bookshelf");
//User authentincation
require("./js/ipcMain/UserAuth");
//
require("./js/ipcMain/menuUI");
//Data queries from catalogs required to fill form data
require("./js/ipcMain/formCombosData");
//Ciudadano registration back-end
require("./js/ipcMain/ciudadano");
//Expediente registration back-end
require("./js/ipcMain/expediente");
//Situacion registration back-end
require("./js/ipcMain/situacion-ipcMain");
//Impresion de expediente
require("./js/ipcMain/expedientePrint");
//Gestion Ciudadanos
require('./js/ipcMain/gestion_ciudadanos');
//Seguimiento
require('./js/ipcMain/seguimiento-ipcMain');