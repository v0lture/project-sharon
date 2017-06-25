/*global Materialize */
/*eslint no-undef: "error"*/

var os = require("os");
const {ipcRenderer} = require("electron");

function testMC() {
    $("#toploader").show();
    $("#error").hide();

    var url = $("#url").val();
    var mode = $("#mode").val();
    var user = $("#username").val();
    var key = $("#key").val();
    var ext;
    var warning = "";

    if(url === "" || mode === "" || user === "" || key === ""){
        $("#toploader").hide();
        $("#error").show();
        $("#error > span").text("Please fill out all fields");
        return;
    }

    // Determine if in deployment or testing mode
    if(mode === "testing"){
        ext = ".json";
        warning = "<b class='accent-text' style='font-size: 18px; font-weight: 300;'>THIS MANAGEMENT CONSOLE IS RUNNING IN TESTING MODE! IF YOU ARE USING THIS MANAGEMENT CONSOLE IN PRODUCTION, RECONFIGURE YOUR CONSOLE!</b><br /><br />";
    } else {
        ext = ".php?user="+user+"&mac=ab:cd:ef:12:34:56";
    }

    // Continue with script
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState === 4) {
            $("#toploader").hide();
            // Not found
            console.log(this);
            if(this.status === 404 || this.status === 0){
                $("#error").show();
                $("#error > span").text("A Management Console was not found at the supplied host and path. Double check with your administrator for correct details.");
            } else if(this.status === 500){
                // management console has a critical error
                $("#error").show();
                $("#error > span").text("The Management Console Endpoint has encountered a critical error. Contact your administrator to correct this issue.");
            } else if(this.status === 200){
                // management console responded
                Materialize.toast("Found Management Console", 2000);
                var output = JSON.parse(this.responseText);
                console.dir(output);

                $(".modal").modal();
                $("#MCinfo").modal("open");

                $("#MCinfo > .modal-content").html("<h4>Join Management Console?</h4>"+warning+"<p>You are trying to join Management Console <b>"+output.console.name+"</b> in company <b>"+output.console.company+"</b> &mdash; v"+output.console.version+"<br /><br /><b>About this Management Console</b>:<br />"+output.messages.general+"<br /><br /><b>Data collection policy</b>:<br />"+output.messages.collected+"<br /><br /><b>Project Sharon use policy:</b><br />"+output.messages.use+"<br /><br />Joining this Management Console will grant the administrators access over your device via application/file policies, remote access, execution, and device monitoring. You will be granted access to mandatory and optional applications/files to install/download.<br />Depending on your administrator's configuration, you may be able to leave this console by pressing the 'Leave' button under Console in the settings menu.<br /><br /><b>Press Cancel to abort joining this console and go back to the details configuration menu.<br />Press Join to join the Management Console and agree to the policies outlined above.</b></p>");
            }
        }
    };

    xhttp.open("GET", url+"/client-endpoint/register"+ext, true);
    xhttp.send();
}

// join the MC
function joinMC() {
    $("#details").hide();
    $("#joining").show();
    $("#toploader").show();

    var url = $("#url").val();
    var mode = $("#mode").val();
    var user = $("#username").val();
    var key = $("#key").val();

    if(url === "" || mode === "" || user === "" || key === ""){
        $("#toploader").hide();
        $("#details").show();
        $("#joining").hide();
        $("#error > span").text("Please fill out all fields");
        return;
    }

    // submit req
    ipcRenderer.send("join-management-console", {url, mode, user, key});
}

// testing purposes only
function testEnv() {
    $("#host").val("localhost");
    $("#path").val("PS-MC-test");
    $("#mode").val("testing");
    $("#username").val(os.userInfo().username);
    $("#key").val("IGNOREKEY");
    Materialize.updateTextFields();
    
    $(".modal").modal();
    $("#MCinfo").modal("open");

    $("#MCinfo > .modal-content").html("<h4>Enter demo mode?</h4><p><b>You pressed the testing mode button.</b><br />You will not be able to connect to any management consoles if you accept until you leave testing mode within settings.<br />Testing mode will not make any changes to your device or grant your device to any organization's console.<br /><br />If you are not a developer, please click Cancel. Otherwise, click Join to proceed.</p>");
}

// handle ipc response
ipcRenderer.on("join-management-console-reply", (event, arg) => {
    console.log(arg);

    if(arg.state === "success"){
        $("#toploader").hide();
        window.location = "index.html";
    } else {
        $("#toploader").hide();
        $("#details").show();
        $("#joining").hide();
        $("#error > span").text("Failed to join Management Console. Please try again later.");
        console.warn(arg);
    }
});