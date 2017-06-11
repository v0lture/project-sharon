// Runs from main process
const {ipcMain} = require("electron");

ipcMain.on("install-job-begin", (event, arg) => {
    console.log("Beginning install job for AppID "+arg.appid);

    setTimeout(() => {
        event.sender.send("install-job-running", arg);
    }, 5000);

    setTimeout(() => {
        event.sender.send("install-job-done", arg);
    }, 15000);
});