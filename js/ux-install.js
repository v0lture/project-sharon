// Runs from main process
const {ipcMain} = require("electron");

var queue = {
    "pending": 0,
    "downloading": 0,
    "downloaded": 0,
    "installing": 0,
    "installed": 0,
    "updating": 0,
    "updated": 0,
    "failed": 0
}

var queueitems = new Array();
var queuei = 0;
var activemax = 1;
let mainWindow;

exports.define = (w) => {
    mainWindow = w;
    return;
}

// Download -> Install process
function beginQueue(appid) {
    mainWindow.webContents.send("install-job-downloading", {appid});
    queue.pending--;
    queue.downloading++;
    console.log("Running queue job for AppID "+appid);
    setTimeout(() => {
        mainWindow.webContents.send("install-job-installing", {appid});
        queue.downloading--;
        queue.installing++;
        console.log("Installing queue job for AppID "+appid);
    }, 5000);

    setTimeout(() => {
        mainWindow.webContents.send("install-job-done", {appid});
        queue.installing--;
        queue.installed++;
        console.log("Finished queue job for AppID "+appid);
        processQueue();
    }, 10000);
};

// Handle queuing
function processQueue(){
    var active = queue.downloading + queue.installing + queue.updating;
    
    console.log("Pending jobs: "+queue.pending+" -- Active jobs: "+active);

    if(active > activemax || queue.pending === 0){
        // active processes
        return;
    }

    beginQueue(queueitems[queuei]);
    queuei++;
}

ipcMain.on("install-job-begin", (event, arg) => {
    console.log("Queuing job for AppID "+arg.appid+"...");
    queue.pending++;
    queueitems.push(arg.appid);
    processQueue();
});

ipcMain.on("install-job-abort", (e, a) => {
    console.log("RECEIVED ABORT SIGNAL");
    queue.failed = queue.pending;
    queue.pending = 0;
    queueitems = new Array();
    queuei = 0;
    e.sender.send("install-job-aborted");
});

ipcMain.on("install-job-hyper", (e, a) => {
    activemax = a;
    console.log("HYPER! New rate: "+a);
});