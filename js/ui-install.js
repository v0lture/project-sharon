// Runs from renderer process
const {ipcRenderer} = require("electron");

var states = {
    "pending": 0,
    "installing": 0,
    "installed": 0,
    "has-update": 0,
    "updating": 0,
    "downloading": 0,
    "failed": 0
};

// update UI based on values
function stateUIRefresh() {
    if(states.installing === 0){
        $("#installed-installing").slideUp();
    }

    if(states.pending === 0){
        $("#installed-pending").slideUp();
    }

    if(states.installed === 0){
        $("#installed-installed").slideUp();
    }
}

// install an app from its appid
function install(appid){
    $("#installed-pending").show();
    $("#installed-pending > .scroll > .items").append("<div id=\"appid-"+appid+"-pending\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+appid+"</p><p class=\"corner right\">Pending</p></div>");

    states.pending++;

    // begin install job
    ipcRenderer.send("install-job-begin", {appid});
    stateUIRefresh();
}

// on ready response
ipcRenderer.on("install-job-running", (e, a) => {

    states.pending--;
    states.installing++;

    $("#appid-"+a.appid+"-pending").remove();
    $("#installed-installing").show();
    $("#toploader").show();
    $("#installed-installing > .scroll > .items").append("<div id=\"appid-"+a.appid+"-installing\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+a.appid+"</p><p class=\"corner right\">Installing</p></div>");
    stateUIRefresh();
});

// on finished response
ipcRenderer.on("install-job-done", (e, a) => {

    states.installing--;
    states.installed++;

    $("#toploader").hide();
    $("#appid-"+a.appid+"-installing").remove();
    Materialize.toast("AppID "+a.appid+" is installed.", 5000);

    $("#installed-installed").show();
    $("#installed-installed > .scroll > .items").append("<div id=\"appid-"+a.appid+"-installed\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+a.appid+"</p><p class=\"corner right\">Installing</p></div>");
    stateUIRefresh();
});

// test func
function installtest() {
    install(1);
    setTimeout(() => {install(2);}, 1000);
    setTimeout(() => {install(3);}, 2000);
    setTimeout(() => {install(4);}, 3000);
    setTimeout(() => {install(5);}, 4000);
    setTimeout(() => {install(6);}, 5000);
    setTimeout(() => {install(7);}, 6000);
    setTimeout(() => {install(8);}, 7000);
    setTimeout(() => {install(9);}, 8000);
    setTimeout(() => {install(10);}, 9000);
    setTimeout(() => {install(11);}, 1000);
    setTimeout(() => {install(12);}, 2000);
    setTimeout(() => {install(13);}, 3000);
    setTimeout(() => {install(14);}, 4000);
    setTimeout(() => {install(15);}, 5000);
    setTimeout(() => {install(16);}, 6000);
    setTimeout(() => {install(17);}, 7000);
    setTimeout(() => {install(18);}, 8000);
    setTimeout(() => {install(19);}, 9000);
    setTimeout(() => {install(20);}, 1000);
    setTimeout(() => {install(21);}, 2000);
    setTimeout(() => {install(22);}, 3000);
    setTimeout(() => {install(23);}, 4000);
    setTimeout(() => {install(24);}, 5000);
    setTimeout(() => {install(25);}, 6000);
    setTimeout(() => {install(26);}, 7000);
    setTimeout(() => {install(27);}, 8000);
    setTimeout(() => {install(28);}, 9000);
}
