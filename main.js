// Requires and consts
const electron = require("electron");
const app = electron.app;
const {ipcMain} = electron.app;
const {Menu} = require("electron");
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require("fs");
let mainWindow;
require("./js/join-leave.js");
const uxinstall = require("./js/ux-install.js");

// create main app window
function spawnAppWindow(item) {
    mainWindow = new BrowserWindow({width: 1200, height: 800});
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, item+".html"),
        protocol: "file:",
        slashes: true
    }));
    mainWindow.openDevTools();
    uxinstall.define(mainWindow);

    console.log("Opening "+item);
    // on close event
    mainWindow.on("closed", function () {
        mainWindow = null;
    });
}

// handle app events
app.on("ready", () => {
    // delete menus
    Menu.setApplicationMenu(null);
    // check if app config is set
    var configpath = app.getPath("appData")+"/project-sharon-client/management.json";

    console.log("Loading config "+configpath+"...");

    fs.access(configpath, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        // If the file exists, open main app
        if(err === null){
            spawnAppWindow("index");
        } else {
            spawnAppWindow("onboarding");
        }
    });

    // events to occur when Electron is ready
});

app.on("all-windows-closed", () => {
    // events to occur when all the app windows have closed
});

app.on("activate", () => {
    // events to occur when application is launched when closed
    if(mainWindow === null) {
        spawnAppWindow();
    }
});

app.on("will-quit", (e) => {
    // prevent app from exiting so it stays running in background
    console.log("Still running in the background.");
    e.preventDefault();
});

app.on("quit", (e) => {
    // on app exit
});

