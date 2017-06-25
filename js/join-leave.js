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
    };

    var configpath = app.getPath("appData")+"/project-sharon-client/management.json";
    
    fs.mkdir(app.getPath("appData")+"/project-sharon-client", (e) => {
        if(e === null || e.code === "EEXIST"){
            console.log("Writing config "+configpath+"...");

            jsonfile.writeFile(configpath, data, function (err) {
                if(err === null){
                    event.sender.send("join-management-console-reply", {"state": "success", "message": ""});
                } else {
                    event.sender.send("join-management-console-reply", {"state": "error", "message": err});
                    console.log(err);
                }
            });
        } else {
            event.sender.send("join-management-console-reply", {"state": "error", "message": e});
            console.log("Error occurred while creating directory.");
            console.log(e);
        }
    });

    
});

// leave a console
ipcMain.on("leave-management-console", (e, a) => {
    var configpath = app.getPath("appData")+"/project-sharon-client/management.json";
    fs.unlink(configpath, (err) => {
        if(err === null){
            e.sender.send("leave-management-console-reply", {"state": "success", "message": ""});
        } else {
            e.sender.send("leave-management-console-reply", {"state": "error", "message": err});
        }
    })
});