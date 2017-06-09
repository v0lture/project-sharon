// requires
const electron = require("electron");
const app = electron.app;
const {ipcMain} = require("electron");
const BrowserWindow = electron.BrowserWindow;
const path = require("path");
const url = require("url");
const fs = require("fs");
const jsonfile = require("jsonfile");

ipcMain.on("join-management-console", (event, arg) => {
    console.dir(arg);

    var data = {
        "console": {
            "host": arg.host,
            "path": arg.path,
            "mode": arg.mode
        }, 
        "auth": {
            "user": arg.user,
            "key": arg.key
        }
    }

    var configpath = app.getPath("appData")+"/project-sharon-client/management.json";

    console.log("Writing config "+configpath+"...");

    jsonfile.writeFile(configpath, data, function (err) {
        if(err === null){
            event.sender.send('join-management-console-reply', {"state": "success", "message": ""});
        } else {
            event.sender.send('join-management-console-reply', {"state": "error", "message": err});
        }
    })
})