// Runs from renderer process
const {ipcRenderer} = require("electron");

var states = {
    "pending": 0,
    "installing": 0,
    "installed": 0,
    "has-update": 0,
    "updating": 0,
    "downloading": 0,
    "failed": 0,
    "jobs": 0
};

// update UI based on values
function stateUIRefresh() {
    if(states.installing === 0){
        $("#installed-installing").slideUp();
    }

    if(states.pending === 0){
        $("#installed-pending").slideUp();
    }

    if(states.downloading === 0){
        $("#installed-downloading").slideUp();
    }

    if(states.installed === 0){
        $("#installed-installed").slideUp();
    }

    // make progress bar useful
    var total = states.jobs;
    var active = states.installed;
    
    console.log("Active: "+active+" -- Total: "+total);
    if(states.installed === 0){
        $("#toploader > div").removeClass("determinate").addClass("indeterminate").attr("style", "");
    } else {
        $("#toploader > div").addClass("determinate").removeClass("indeterminate").attr("style", "width: "+((active / total)*100)+"%");
    }

    if((active / total) >= 1){
        $("#toploader").hide();
    } else {
        $("#toploader").show();
    }
}

// function dump queue
function killqueue() {
    ipcRenderer.send("install-job-abort");
}

ipcRenderer.on("install-job-aborted", (e, a) => {
    $("#toploader").hide();
    states.failed = states.pending;
    states.pending = 0;
    states.jobs = 0;
    $("#installed-pending > .scroll > .items").html("");
    stateUIRefresh();
    Materialize.toast("Job queue aborted.", 1000);
})

// install an app from its appid
function install(appid){
    $("#installed-pending").show();
    $("#installed-pending > .scroll > .items").append("<div id=\"appid-"+appid+"-pending\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+appid+"</p><p class=\"corner right\">Pending</p></div>");

    states.pending++;
    states.jobs++;

    // begin install job
    ipcRenderer.send("install-job-begin", {appid});
    stateUIRefresh();
}

// ondownload ersponse
ipcRenderer.on("install-job-downloading", (e, a) => {

    states.pending--;
    states.downloading++;

    $("#appid-"+a.appid+"-pending").remove();
    $("#installed-downloading").show();
    $("#installed-downloading > .scroll > .items").append("<div id=\"appid-"+a.appid+"-downloading\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+a.appid+"</p><p class=\"corner right\">Downloading</p></div>");
    stateUIRefresh();
});


// on ready response
ipcRenderer.on("install-job-installing", (e, a) => {

    states.downloading--;
    states.installing++;

    $("#appid-"+a.appid+"-downloading").remove();
    $("#installed-installing").show();
    $("#installed-installing > .scroll > .items").append("<div id=\"appid-"+a.appid+"-installing\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+a.appid+"</p><p class=\"corner right\">Installing</p></div>");
    stateUIRefresh();
});

// on finished response
ipcRenderer.on("install-job-done", (e, a) => {

    states.installing--;
    states.installed++;

    $("#appid-"+a.appid+"-installing").remove();
    Materialize.toast("AppID "+a.appid+" is installed.", 5000);

    $("#installed-installed").show();
    $("#installed-installed > .scroll > .items").append("<div id=\"appid-"+a.appid+"-installed\" class=\"item waves-effect waves-light\"><div class=\"center-align\"><img src=\"img/app.png\"></img></div><p class=\"title\">"+a.appid+"</p><p class=\"corner right\">Installed</p></div>");
    stateUIRefresh();


});

// hyper mode
function hyper(rate) {
    console.log("Adjusting job rate to "+rate+"...");
    ipcRenderer.send("install-job-hyper", rate);
}

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