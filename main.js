// Requires and consts
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
let mainWindow;

// create main app window
function spawnAppWindow() {
    mainWindow = new BrowserWindow({width: 800, height: 600})
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    // on close event
    mainWindow.on('closed', function () {
        mainWindow = null;
    })
}

// handle app events
app.on("ready", () => {
    spawnAppWindow();
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
})

app.on("will-quit", (e) => {
    // prevent app from exiting so it stays running in background
    console.log("Still running in the background.");
    e.preventDefault();
})