/*global Materialize */
/*eslint no-undef: "error"*/
const {ipcRenderer} = require("electron");

function cmd(){
    var cmd = $("#cli").val();
    $("#toploader").show();
    $("div.searchwrap").slideUp();
    $("#cmdupdate").html("<b>Resolving</b> &mdash; Analyzing command...");
    cmd = cmd.split(/[ ,]+/);

    if(cmd[0].indexOf("management-console") !== -1){
        // Management Console operations
        $("#cmdupdate").html("<b>Resolving</b> &mdash; Understood management-console so far...");
        if(cmd[1].indexOf("leave") !== -1 || cmd[1].indexOf("quit") !== -1 || cmd[1].indexOf("disconnect") !== -1 || cmd[1].indexOf("dc") !== -1 || cmd[1].indexOf("drop") !== -1){
            // Leave console
            $("#cmdupdate").html("<b>Requested</b> &mdash; Requested a management console disconnect, waiting on <code>join-leave</code> to respond.");
            ipcRenderer.send("leave-management-console", {});
        } else {
            $("#toploader").hide();
            $("div.searchwrap").slideDown();
            $("#cmdupdate").html("<b>Resolved</b> &mdash; Command unresolvable.");
        }
    } else if(cmd[0].indexOf("package") !== -1) {
        // Package operations
        $("#cmdupdate").html("<b>Resolving</b> &mdash; Understood package so far...");
        if(cmd[1].indexOf("install") !== -1){
            // Install package
            $("#cmdupdate").html("<b>Requested</b> &mdash; Package install request submitted, waiting on <code>ux-install</code> to respond.");
            ipcRenderer.send("install-job-begin", {"appid": cmd[2]});
        } else if(cmd[1].indexOf("rate") !== -1){
            // Change package install rate
            $("#toploader").hide();
            $("div.searchwrap").slideDown();
            $("#cmdupdate").html("<b>Updated</b> &mdash; Package install rate updated. Changes only apply to future installations.");
            ipcRenderer.send("install-job-hyper", {"rate": cmd[2]});
        }
    }
}

ipcRenderer.on("settings-responder", (e, a) => {
    $("#toploader").hide();
    $("div.searchwrap").slideDown();
    $("#cmdupdate").html("<b>Finished</b> &mdash; Finished operation <code>"+a.operation+"</code>.");
});

function breakOp() {
    $("#toploader").hide();
    $("div.searchwrap").slideDown();
    $("#cmdupdate").html("<b>Broken</b> &mdash; Operation was broken by user.");
}

// handle package ops
// ondownload response
ipcRenderer.on("install-job-downloading", (e, a) => {
    $("#cmdupdate").html("<b>Package Downloading</b> &mdash; Appid "+a.appid+" is downloading");
});


// on ready response
ipcRenderer.on("install-job-installing", (e, a) => {
    $("#cmdupdate").html("<b>Package Installing</b> &mdash; Appid "+a.appid+" is installing");
});

// on finished response
ipcRenderer.on("install-job-done", (e, a) => {
    $("#toploader").hide();
    $("div.searchwrap").slideDown();
    $("#cmdupdate").html("<b>Package Installed</b> &mdash; Appid "+a.appid+" is installed");
});