import { GoldenLayout, LayoutConfig } from "../golden-layout/bundle/esm/golden-layout.js";
import { configNonBeta } from './nonbetaConfig.js';



/*
         VERSION NUMBERS
*/

const showChangelogVersion = "1.2.2";  //update all instances of ?version= in the index file to match the version. This is needed for local cache busting
window.latestMicroPythonVersion = [1, 25, 0];

// this is needed because version 1.25.0 is not released yet and so the version number is not changing. Some boards
// got shipped with a version before this beta06. So this will help.
window.latestMicroPythonVersionPlus = "beta06"
//Set to true if latestMicroPythonVersionPlus is empty.
window.MPVersionPlus = false;

window.xrpID = "";


const layoutSaveKey = "layout";

var myLayout = new GoldenLayout(document.getElementById("IDLayoutContainer"));
var DIR = new DIRCHOOSER();
var SAVEAS_ELEMENT = document.getElementById("IDSaveAs");  //element to use with the SaveAs dialog box.

var onExportToEditor = (bytes) => {
    var editorSpriteID = 0;
    var filePath = undefined;
    while(true){
        var increased = false;
        filePath = "/sprite" + editorSpriteID + ".bin";

        for (const [id, editor] of Object.entries(EDITORS)) {
            if(editor.EDITOR_PATH == filePath){
                editorSpriteID = editorSpriteID + 1;
                increased = true;
            }
        }
        if(increased == false){
            break;
        }
    }

    // Find editor with smallest ID, focus it, then add new editor with file contents
    var currentId = Infinity;
    for (const [id, editor] of Object.entries(EDITORS)) {
        currentId = id;
    }
    if(currentId != Infinity){
        EDITORS[currentId]._container.parent.focus();
    }

    // Pass the file contents to the new editor using the state
    var state = {};
    state.value = bytes;
    state.path = filePath;
    myLayout.addComponent('Editor', state, 'Editor');
}

// Show pop-up containing IDE changelog every time showChangelogVersion changes
// Update version string in index.html and play.html as well to match

let response = await fetch("lib/package.json" + "?version=" + showChangelogVersion);
response = await response.text();
let jresp = JSON.parse(response);
let v = jresp.version
// This should match what is in /lib/XRPLib/version.py as '__version__'
window.latestLibraryVersion = v.split(".");

window.phewList = ["__init__.py","dns.py","logging.py","server.py","template.py"];
window.bleList = ["__init__.py","blerepl.py", "ble_uart_peripheral.py", "isrunning"]  //bugbug: ble_uart_peripheral looks for ##XRPSTOP## so we can't update via bluetooth. Could be fixed with a hash operation

window.SHOWMAIN = false;

if(localStorage.getItem("version") == null || localStorage.getItem("version") != showChangelogVersion ){

    console.log("Updates to IDE! Showing changelog...");    // Show message in console

    fetch("CHANGELOG.txt?version=" + showChangelogVersion).then(async (response) => {
        await response.text().then(async (text) => {
            await dialogMessage(marked.parse(text));
        });
    });

    localStorage.setItem("version", showChangelogVersion);       // Set this show not shown on next page load
   // }
}

// Want the dropdown to disappear if mouse leaves it (doesn't disappear if mouse leaves button that starts it though)
//document.getElementById("IDUtilitesDropdown").addEventListener("mouseleave", () => {
//    UIkit.dropdown(document.getElementById("IDUtilitesDropdown")).hide();
//})

var progressBarElem = document.getElementById("IDProgressBar");
var progressBarText = document.getElementById("IDProgressBar_Text");
document.getElementById("IdProgress_TitleText").innerText = 'Update in Progress...';
var lastMessage = undefined;
window.setPercent = (percent, message) => {
    progressBarElem.style.width = percent + "%";

    if (message != undefined) {
        progressBarText.innerText = message + " " + percent + "%";
        lastMessage = message;
    } else {
        progressBarText.innerText = lastMessage + " " + Math.round(percent) + "%";
    }
};

window.resetPercentDelay = () => {
    setTimeout(() => {
        progressBarElem.style.width = "0%";
        progressBarText.innerText = "";
    }, 100);
};

var defaultConfig = {
    header:{
        popout: false,
        showCloseIcon: false
    },
    dimensions: {
        borderWidth: 5,
        minItemHeight: 10,
        minItemWidth: 10,
        headerHeight: 20,
        dragProxyWidth: 300,
        dragProxyHeight: 200
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        minimise: 'minimise',
        popout: 'open in new window'
    },


    content: [{
        type: 'column',
        id: 'rootcolumn',
        content: [{
            type: 'row',
            isClosable: false,
            id: 'rootrow',
            content:[{
                type: 'stack',
                width: 18,
                id: 'justFS',
                content:[{
                    type: 'component',
                    componentName: 'Filesystem',
                    isClosable: false,
                    componentState: { label: 'XRP Files' },
                    title: 'Filesystem',
                    id: "aFilesystem"
                }]
            },{
                type: 'column',
                content:[{
                    type: 'stack',
                    id: "EditorAndShell",
                    content:[{
                        type: 'component',
                        componentName: 'Editor',
                        componentState: { label: 'Editor', editor: undefined, choose: true},
                        title: 'Editor',
                        id: "aEditor"
                    }],
                },
                {
                    type: 'stack',
                    content:[{
                        type: 'component',
                        componentName: 'Shell',
                        isClosable: false,
                        componentState: { label: 'Shell' },
                        title: 'Shell',
                        id: "aShell"
                    }],
                    height: 20
                }
            ]
            }],
        }],
    }],
};


document.getElementById("IDStopBTN").onclick = async (event) =>{
    if(REPL.DISCONNECT == true){
        window.alertMessage("No XRP is connected. Double-check that the XRP is connected before attempting to STOP a program.");
        return;
    }
    // document.getElementById("IDStopBTN").disabled = true;
    document.getElementById('IDRunBTN').style.display = "none";
    await REPL.stop();
    // document.getElementById("IDStopBTN").disabled = false;

}

// This is to make the menus act more like true menus. When the menu dropdowns are active then moving to the next menu switches to that menu.
var FILE_BUTTON = document.getElementById("IDFileBTN");
var VIEW_BUTTON = document.getElementById("IDViewBTN");
var HELP_BUTTON = document.getElementById("IDHelpBTN");
var FILE_DROPDOWN = document.getElementById("IDFile");
var VIEW_DROPDOWN = document.getElementById("IDView");
var HELP_DROPDOWN = document.getElementById("IDHelpDrop");



var menus_down = false;
FILE_BUTTON.addEventListener("mouseenter", () => {
    if(menus_down){
        UIkit.dropdown(FILE_DROPDOWN).show();
    }
});

VIEW_BUTTON.addEventListener("mouseenter", () => {
    if(menus_down){
        UIkit.dropdown(VIEW_DROPDOWN).show();
    }
});

HELP_BUTTON.addEventListener("mouseenter", () => {
    if(menus_down){
        UIkit.dropdown(HELP_DROPDOWN).show();
    }
});

FILE_DROPDOWN.addEventListener("show", () => {
    menus_down = true;
});

FILE_DROPDOWN.addEventListener("hide", () => {
    menus_down = false;
});
VIEW_DROPDOWN.addEventListener("show", () => {
    menus_down = true;
});

VIEW_DROPDOWN.addEventListener("hide", () => {
    menus_down = false;
});
HELP_DROPDOWN.addEventListener("show", () => {
    menus_down = true;
});

HELP_DROPDOWN.addEventListener("hide", () => {
    menus_down = false;
});

// File Menu Support
FILE_BUTTON.onclick = (event) =>{
    //get active file id
    getActiveId();
}
FILE_DROPDOWN.addEventListener("mouseleave", () => {
    UIkit.dropdown(FILE_DROPDOWN).hide();
});

document.getElementById("IDFileAdd").onclick = (event) =>{
    UIkit.dropdown(FILE_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].addNewEditor();
}

document.getElementById("IDFileUpload").onclick = (event) =>{
    UIkit.dropdown(FILE_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].onUploadFiles();
}

document.getElementById("IDFileExport").onclick = (event) =>{
    UIkit.dropdown(FILE_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].onDownloadFile(EDITORS[id].EDITOR_PATH);;
}

document.getElementById("IDFileSave").onclick = (event) =>{
    UIkit.dropdown(FILE_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].onSaveToThumby();
}

document.getElementById("IDFileSaveAs").onclick = (event) =>{
    UIkit.dropdown(FILE_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].onSaveAsToThumby();
}

// View Menu Support
VIEW_BUTTON.onclick = (event) =>{
    //get active file id
    getActiveId();
}
VIEW_DROPDOWN.addEventListener("mouseleave", () => {
    UIkit.dropdown(VIEW_DROPDOWN).hide();
});

// View Menu Blockly Support
var opAce;
document.getElementById("IDViewVM").onclick = (event) =>{
    UIkit.dropdown(VIEW_DROPDOWN).hide();
    document.getElementById("view-python-button").onclick = (ev) => {
        opAce.destroy();
    };
    opAce = ace.edit("view-python-ace");
    opAce.session.setMode("ace/mode/python");
    opAce.setReadOnly(true);
    opAce.setTheme("ace/theme/tomorrow_night_bright");
    let id = localStorage.getItem("activeTabId");
    opAce.setValue(EDITORS[id].getValue(), 1);
    UIkit.modal(document.getElementById("view-python-code")).show();
}
document.getElementById("IDViewCM").onclick = async (event) =>{
    UIkit.dropdown(VIEW_DROPDOWN).hide();
    if(! await window.confirmMessage("This will convert your Blocks program to a Python program.<br> Your Blocks program will be put in the trash<br>and a new python program will be created.<br>Are you sure you want to continue?")){
        return;
    }
    let id = localStorage.getItem("activeTabId");
    await EDITORS[id].onConvert(EDITORS[id].EDITOR_PATH, EDITORS[id].getValue(), id);
}

// View Menu ACE Support


document.getElementById("IDViewIncF").onclick = (event) =>{
    UIkit.dropdown(VIEW_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].increaseFontSize();
}
document.getElementById("IDViewDecF").onclick = (event) =>{
    UIkit.dropdown(VIEW_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].decreaseFontSize();
}
/*
document.getElementById("IDViewResetF").onclick = (event) =>{
    UIkit.dropdown(VIEW_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].resetFontSize();
}
*/
document.getElementById("IDViewAutoComplete").onclick = (event) =>{
    UIkit.dropdown(VIEW_DROPDOWN).hide();
    let id = localStorage.getItem("activeTabId");
    EDITORS[id].toggleAutocompleteStateForAll();
}

//Help Menu Support
HELP_BUTTON.onclick = (event) =>{
    //get active file id
    getActiveId();
}
HELP_DROPDOWN.addEventListener("mouseleave", () => {
    UIkit.dropdown(HELP_DROPDOWN).hide();
})

document.getElementById("IDUserGuide").onclick = (event) =>{
    UIkit.dropdown(HELP_DROPDOWN).hide();
    menus_down = false;
    window.open("https://xrpusersguide.readthedocs.io/en/latest/course/introduction.html", "_blank")
}
document.getElementById("IDAPI").onclick = (event) =>{
    UIkit.dropdown(HELP_DROPDOWN).hide();
    window.open("https://open-stem.github.io/XRP_MicroPython/", "_blank")
}

document.getElementById("IDCURR").onclick = (event) =>{
    UIkit.dropdown(HELP_DROPDOWN).hide();
    window.open("https://introtoroboticsv2.readthedocs.io/en/latest/", "_blank")
}

document.getElementById("IDFORUM").onclick = (event) =>{
    UIkit.dropdown(HELP_DROPDOWN).hide();
    window.open("https://xrp.discourse.group/", "_blank")
}

document.getElementById("IDCHANGE").onclick = (event) =>{
    UIkit.dropdown(HELP_DROPDOWN).hide();
    fetch("CHANGELOG.txt?version=" + Math.floor(Math.random() * (100 - 1) + 1)).then(async (response) => {
        await response.text().then(async (text) => {
            await dialogMessage(marked.parse(text));
        });
    });
}

disableMenuItems(); 

document.getElementById("IDRunBTN").onclick = async (event) =>{
    document.getElementById("IDRunBTN").disabled = true;
    let id = getActiveId(); 
    EDITORS[id].runXRPCode();
    document.getElementById("IDRunBTN").disabled = false;

};

// Return true if a panel with this title exists, false otherwise
function recursiveFindTitle(content, title){
    for(var i=0; i < content.length; i++){
        if(content[i].title != undefined && content[i].title == title){
            return true;
        }
        if(content[i].content != undefined){
            if(recursiveFindTitle(content[i].content, title) == true){
                return true;
            }
        }
    }
    return false;
}


// Fill 'editors' with editor panel from every panel with 'editor' in name
function recursiveFindEditors(content, editors){
    for(var i=0; i < content.length; i++){
        if(content[i].title != undefined && content[i].title.indexOf("Editor") != -1){
            editors.push(content[i]);
        }
        if(content[i].content != undefined){
            recursiveFindEditors(content[i].content, editors);
        }
    }
}

// Setup REPL module
var REPL = new ReplJS();
window.REPL = REPL;


// Filesystem module

// Add the overlay to the Filesystem container.
function addFSOverlay() {
    let overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.top = 0;
    overlay.style.right = 0;
    overlay.style.bottom = 0;
    overlay.style.left = 0;
    overlay.style.background = 'rgba(255,255,255,0.3)';
    overlay.id = 'overlay'; // Add an ID or class for later reference
    FS._container._element.appendChild(overlay);
}

// Remove the overlay from the Filesystem container.
function removeFSOverlay() {
    let overlay = FS._container._element.querySelector('#overlay');
    if (overlay) {
        overlay.remove();
    }
}
var FS = undefined;
function registerFilesystem(_container, state){
    FS = new FILESYSTEM(_container, state);

    DIR.onRename = (path) => REPL.renameFile(path, prompt("Type a new name: ", path.substring(path.lastIndexOf("/") + 1)));

    DIR.onRename = async (path) => {
        var [ans, pathNew] = await window.promptMessage("Type a new name: ", path.substring(path.lastIndexOf("/")+1));
        if(ans == false) return;
        REPL.renameFile(path, pathNew);
    }
    DIR.onNewFolder = async (fileOrDir, path) => {
        var [ans, newFolderName] = await window.promptMessage("Enter the new folder name: ", "NewFolder");
        if(ans == false) return;
        if(newFolderName != null){
            if(fileOrDir == 1){ // Dir
                await REPL.buildPath(path + "/" + newFolderName);
            }else{              // File
                await REPL.buildPath(path.substring(0, path.lastIndexOf("/")) + "/" + newFolderName);
            }
            await REPL.getOnBoardFSTree();
        }
    }

    // DIR.onNewFile = async () => {
    //     var id1;
    //     for (const [id] of Object.entries(EDITORS)) {
    //         id1 = id;
    //         break;
    //     }

    //     EDITORS[id1]._container.focus();   //make sure the focus is on the editor section.
    //     myLayout.addComponent('Editor', { "value": undefined, choose: true }, 'Editor');
    //     console.log('Creating a new file...');
    // }

    // DIR.onNewFile = async (fileOrDir, path) => {
    //     var newFolderName = prompt("Enter the new folder name: ", "NewFolder");
    //     if(newFolderName != null){
    //         if(fileOrDir == 1){ // Dir
    //             await REPL.buildPath(path + "/" + newFolderName);
    //         }else{              // File
    //             await REPL.buildPath(path.substring(0, path.lastIndexOf("/")) + "/" + newFolderName);
    //         }
    //         await REPL.getOnBoardFSTree();
    //     }
    // }

    FS.onDelete = (path) => REPL.deleteFileOrDir(path);

    //[TODO] - Don't let them pick main.py if it is not turned on
    FS.onRename = async (path) => {
        var [ans, pathNew] = await window.promptMessage("Type a new name: ", path.substring(path.lastIndexOf("/")+1));
        if(ans == false) return;
        REPL.renameFile(path, pathNew);
    }
    FS.onFormat = () => REPL.format();
    FS.onUpdate = () => REPL.update();
    // FS.onUploadFiles = async () => {
    //     if(REPL.PORT != undefined){
    //         console.log("Pick files to upload");
    //         const fileHandles = await window.showOpenFilePicker({multiple: true});
    //         if(fileHandles && fileHandles.length > 0){
    //             var path = await DIR.getPathFromUser(SAVEAS_ELEMENT, true, fileHandles[0].name);
    //             if(path != undefined){
    //                 path = path.substring(1,path.lastIndexOf("/")+1);  //strip off the file name to get just the path.
    //                 REPL.uploadFiles(path, fileHandles);
    //             }
    //         }
    //     }else{
    //         window.alertMessage("No XRP is connected. Files can not be uploaded. Double-check that the XRP is connected before attempting to upload a file.");
    //     }
    // }
    FS.onRefresh = async () => {
        if(REPL.DISCONNECT == false){
            window.setPercent(1, "Refreshing filesystem panel");
            await REPL.getOnBoardFSTree();
            window.setPercent(99.8);
            window.resetPercentDelay();
        }else{
            window.alertMessage("No XRP is connected.");
        }
    }
    FS.onOpen = async (filePath) => {
        // Make sure no editors with this file path already exist
        for (const [id, editor] of Object.entries(EDITORS)) {
            if(editor.EDITOR_PATH != undefined
                && editor.EDITOR_PATH == filePath){
                editor._container.parent.focus();
                //[TODO] If file open and no changes, just switch to that window, If open and changes, ask if OK to overwrite changes?
                //       But what if they are using a new XRP with the same file name?
                //window.alertMessage("This file is already open in Editor" + id + "! Please close it first");
                return;
            }
        }

        var rawFileBytes = await REPL.getFileContents(filePath);
        if(rawFileBytes == undefined){
            //[TODO] This should report something to the user
            return; // RP2040 was busy
        }
        if(filePath.endsWith(".blocks")){
            var data = new TextDecoder().decode(new Uint8Array(rawFileBytes));
            var lines = data.split('##XRPBLOCKS ');
            rawFileBytes = Array.from(new TextEncoder().encode(lines.slice(-1)[0]));
        }
        // Find editor with smallest ID, focus it, then add new editor with file contents
        var currentId = Infinity;
        for (const [id, editor] of Object.entries(EDITORS)) {
            if(id < currentId && id != this.ID){
                currentId = id;
            }
        }
        if(currentId != Infinity){
            EDITORS[currentId]._container.parent.focus();
        }

        // Pass the file contents to the new editor using the state
        var state = {};
        state.value = rawFileBytes;
        state.path = filePath;
        myLayout.addComponent('Editor', state, 'Editor');
    }
    FS.onNewFolder = async (fileOrDir, path) => {
        var [ans, newFolderName] = await window.promptMessage("Enter the new folder name:", "NewFolder");
        if (ans == false) return;
        if(newFolderName != null){
            if(fileOrDir == 1){ // Dir
                await REPL.buildPath(path + "/" + newFolderName);
            }else{              // File
                await REPL.buildPath(path.substring(0, path.lastIndexOf("/")) + "/" + newFolderName);
            }
            await REPL.getOnBoardFSTree();
        }
    }
    FS.onDownloadFiles = async (fullFilePaths) => {
        await downloadFileFromPath(fullFilePaths);
    }

}

async function downloadFileFromPath(fullFilePaths) {
    for(var i=0; i<fullFilePaths.length; i++){
        var startOfFileName = fullFilePaths[i].lastIndexOf('/');
        var fileName = "";
        if(startOfFileName != -1){
            fileName = fullFilePaths[i].substring(startOfFileName+1, fullFilePaths[i].length);
        }else{
            fileName = fullFilePaths[i];
        }

        var fileContents = await REPL.getFileContents(fullFilePaths[i], true);

        window.downloadFileBytes(fileContents, fileName);
    }
}

// init Joystick class when window initializes
var JOY = undefined;
function registerJoy(_container, state){
    JOY = new Joystick(_container, state);
    JOY.writeToDevice = async (data) => { //REPL.writeToDevice(data);
        if(REPL.DATABLE != undefined){
            try{
                await REPL.DATABLE.writeValueWithResponse(data);
            }catch{
                console.log("error writing DATABLE data");
            }
        }
    };
    REPL.startJoyPackets = () => JOY.startJoyPackets();
    REPL.stopJoyPackets = () => JOY.stopJoyPackets();
}

// Terminal module
var ATERM = undefined;
function registerShell(_container, state){
    ATERM = new ActiveTerminal(_container, state);
    window.ATERM = ATERM;
    ATERM.onType = (data) => {
        // When the RP2040 is busy with any utility operations where BUSY is set, only allow interrupt key through
        // Allow certain characters through so thumby can pick them up
        if(REPL.BUSY == true && REPL.RUN_BUSY == false){
           return;
        }
        REPL.writeToDevice(data);
    }

    REPL.onData = (data) => ATERM.write(data);
    REPL.onDisconnect = () => {
        ATERM.writeln("Waiting for connection... (click 'Connect XRP')");
        FS.clearToWaiting();
        window.disableMenuItems();

        // when XRP is disconnected, show the CONNECT XRP button and hide the RUN button
        document.getElementById('IDRunBTN').style.display = "none";
        const connect = document.getElementById('IDConnectBTN');
        connect.style.display = "block";
        if(REPL.BLE_DEVICE == undefined){
            document.getElementById('IDConnectBTN_text').innerText = "Connect XRP";
        }else{
            document.getElementById('IDConnectBTN_text').innerText = "Re-Connect XRP";
            connect.disabled = true;
        }

        // handle the XRP Name and ID
        document.getElementById('IDXRPName').style.display = "none";
        window.xrpID = "";
    }
    REPL.onConnect = () => {
        window.enableMenuItems();
        // when XRP is connected, show the RUN button and hide the CONNECT XRP button
        document.getElementById("IDRunBTN").disabled = false;
        document.getElementById('IDRunBTN').style.display = "block";
        document.getElementById('IDConnectBTN').style.display = "none";
       
        //FS.enableButtons();
    }

    REPL.IDSet = () => {
         //ID this would be a good spot to send window.xrpID to the database
         if(window.xrpID != ""){
            const isBLE = REPL.BLE_DEVICE != undefined;
            const data = {
                XRPID: window.xrpID,
                platform: 'XRPCode',
                BLE: isBLE
            };
            try{
                const response = fetch('https://xrpid-464879733234.us-central1.run.app/data', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
            }
            catch{
                
            }

            document.getElementById('IDXRPName').innerHTML = "XRP-" + window.xrpID.slice(-5);
            document.getElementById('IDXRPName').style.display = "block";
         }
    }

    REPL.pluginCheck = async () =>{
        //check if this is a beta or nonbeta board
        // set the localstorage for this type
        // Add to Blockly if this is a nonbeta board
        // refresh the editors.

        var needsUpdate = false;
        xrpConfig = localStorage.getItem("xrpconfig");
        if(REPL.PROCESSOR == 2350){
            if(xrpConfig == null || xrpConfig === "beta"){
                //we need to set things up
                localStorage.setItem("xrpconfig", "nonbeta");
                await configNonBeta();
                needsUpdate = true;
            }
        }
        else{
            if(xrpConfig != null && xrpConfig === "nonbeta"){
                //we need to go back to beta
                localStorage.setItem("xrpconfig", "beta");
                blocklyToolbox = baseToolbox;
                servoNames = [["1", "1"], ["2", "2"]];
                needsUpdate = true;
            }

        }
        if(needsUpdate){
            for( var editor in EDITORS){
                if(EDITORS[editor].isBlockly){
                    var ed = EDITORS[editor];
                    ed.BLOCKLY_WORKSPACE.updateToolbox(blocklyToolbox);

                    //make sure the editor is pointing to blockly div incase there was an error before.
                    ed.EDITOR_DIV.replaceChild(ed.BLOCKLY_DIV, ed.EDITOR_DIV.childNodes[0]);

                    ed.BLOCKLY_WORKSPACE.clear();
                    //ed.BLOCKLY_DIV.innerHTML = "";
                    var data = localStorage.getItem("EditorValue" + editor)
                    try{
                        Blockly.serialization.workspaces.load(JSON.parse(data), ed.BLOCKLY_WORKSPACE);
                    }
                    catch(e){
                        ed.EDITOR_DIV.replaceChild(ed.ERROR_DIV, ed.EDITOR_DIV.childNodes[0]);
                        //console.log(e);
                    }
                }
            }
        }
    }
    REPL.onFSData = (jsonStrData, fsSizeData) => {
        FS.updateTree(jsonStrData);
        FS.updateStorageBar(fsSizeData);
        DIR.updateTree(jsonStrData);
    };
    REPL.doPrintSeparator = () => {
        ATERM.doPrintSeparator();
    }
    REPL.forceTermNewline = () => {
        ATERM.write("\r\n");
    }
    //REPL.onShowUpdate = () => {FS.showUpdate()};
    REPL.showMicropythonUpdate = async () => {
        if(!REPL.HAS_MICROPYTHON){
            let answer = await confirmMessage("Reinstalling MicroPython onto the XRP<br>" +
                    "please press the reset button while holding down the BOOTSEL button.<br>Then click OK to continue.");
            if(!answer){
                return;
            }
        }
        var message = "The MicroPython on your XRP needs to be updated. The new version is " + window.latestMicroPythonVersion[0] + "." + window.latestMicroPythonVersion[1] + "." + window.latestMicroPythonVersion[2] + " " + window.latestMicroPythonVersionPlus;
        if(REPL.BLE_DEVICE != undefined){
            message += "<br>You will need to connect your XRP with a USB cable in order to update MicroPython";
            await alertMessage(message);
            return;
        }
        message += "<br>Would you like to update now? If so, click OK to proceed with the update."
        let answer = await confirmMessage(message);
        if(answer){
            let drive = "RPI-RP2"
            if(REPL.PROCESSOR == 2350){
                drive = "RP2350"
            }
            await alertMessage("When the <b><i>Select Folder</i></b>  window comes up, select the <b><i>" + drive +"</i></b> drive when it appears.<br>Next, click on <b><i>Edit Files</i></b> and wait for the XRP to reconnect.<br> This process may take a few seconds.");
            REPL.updateMicroPython();
        }


    };
}

// Editor module
var EDITORS = {};
var LAST_ACTIVE_EDITOR = undefined; // Each editor will set this to themselves on focus, bitmap builder uses this
function registerEditor(_container, state) {
    var editor = new EditorWrapper(_container, state, EDITORS);
    editor.onFocus = () => { LAST_ACTIVE_EDITOR = editor };

    editor.onUploadFiles = async () => {
        if(REPL.DISCONNECT == false){
            console.log("Pick files to upload");
            const fileHandles = await window.showOpenFilePicker({multiple: true});
            if(fileHandles && fileHandles.length > 0){
                var path = await DIR.getPathFromUser(SAVEAS_ELEMENT, true, fileHandles[0].name);
                if(path != undefined){
                    path = path.substring(1,path.lastIndexOf("/")+1);  //strip off the file name to get just the path.
                    REPL.uploadFiles(path, fileHandles);
                }
            }
        }else{
            window.alertMessage("No XRP is connected. Files can not be uploaded. Double-check that the XRP is connected before attempting to upload a file.");
        }
    }

    editor.onSaveToThumby = async () => {
        // Warn user when trying to save and no Thumby is connected
        if(REPL.DISCONNECT == true){
            window.alertMessage("No XRP is connected. Any changes made were not saved. Double-check that the XRP is connected before attempting to save the program.");
            return;
        }
        // Not sure that this code will ever happen.
        if(editor.EDITOR_PATH == undefined || editor.EDITOR_PATH == ""){
            if(editor.EDITOR_TITLE == "Choose Mode"){
                //pass
            }
            else{
                console.log('Pick a folder');
                var path = await DIR.getPathFromUser(SAVEAS_ELEMENT);
                if (path != undefined) {
                    // Make sure no editors with this file path already exist
                    for (const [id, editor] of Object.entries(EDITORS)) {
                        if(editor.EDITOR_PATH == path){
                            editor._container.parent.focus();
                            this.alertMessage("This file is already open in Editor" + id + "! Please close it first");
                            return;
                        }
                    }
                    editor.setPath(path);
                    editor.setSaved();
                    editor.updateTitleSaved();
                    editor.onSaveToThumby();
                }
            }
        } else{
            //check if name is untitled
            if(editor.EDITOR_TITLE.search("untitled") != -1){
                await editor.onSaveAsToThumby();
                return;
            }
            console.log('Saved');

            editor.setSaved();

            editor.updateTitleSaved();

            // show progress bar to show saving progress
            UIkit.modal(document.getElementById("IDProgressBarParent")).show();
            document.getElementById("IdProgress_TitleText").innerText = "Saving...";

            var fileData = null;
            if(editor.isBlockly){
                fileData = editor.getValue() + '\n\n\n## ' + getTimestamp() + '\n##XRPBLOCKS ' + editor.getBlockData(); 
            }else{
                fileData = editor.getValue();
            }

            var busy = await REPL.uploadFile(editor.EDITOR_PATH, fileData, true, false);
            if(busy != true){
                //if the file is already in the FSTree then don't get the directory again
                var node = FS.findNodeByName(editor.EDITOR_PATH);
                if(node == null){
                    await REPL.getOnBoardFSTree();
                }
            }

            // close progress bar modal after done saving to XRP
            UIkit.modal(document.getElementById("IDProgressBarParent")).hide();

        }
    }
    editor.onSaveAsToThumby = async () => {
        console.log('Pick a folder');
        var path = await DIR.getPathFromUser(SAVEAS_ELEMENT, false, editor.EDITOR_TITLE.split('/').at(-1));
        if(path != undefined){
            if(path == "/main.py" && window.SHOWMAIN == false){
                window.alertMessage("You can not save a file named 'main.py'<br>Please save again and select a different name");
                return;
            }
            editor.setPath(path);
            editor.setSaved();
            editor.updateTitleSaved();
            await editor.onSaveToThumby();
        }
    }

    editor.addNewEditor = async () => {
        var id1;
        for (const [id] of Object.entries(EDITORS)) {
            id1 = id;
            break;
        }

        EDITORS[id1]._container.focus();   //make sure the focus is on the editor section.
        myLayout.addComponent('Editor', { "value": undefined, choose: true }, 'Editor');
        console.log('Creating a new file...');
    }

    editor.onFastExecute = async (lines) => {

        if(REPL.DISCONNECT == true){
            window.alertMessage("No XRP is connected. Double-check that the XRP is connected before attempting to run the program.");
            return;
        }
        var count = 0;
        while(REPL.BUSY && REPL.RUN_BUSY == false && count < 20){ //if things are busy but not run_busy then let's wait for things to finish
            await window.sleep(10) //we could hang here!!!!
            count += 1;
        }
        if(REPL.BUSY) {
            window.alertMessage("Another program is already running. Stop that program first and then press RUN again.");
            return;
        }

        //handel any special hidden settings
        if(lines.startsWith("#XRPSETTING")){
            var setting = lines.split("\n");
            setting = setting[0].split("#XRPSETTING")[1];
            setting = setting.trimEnd();
            switch(setting){
                case "-localstorage":
                    localStorage.clear();
                    break;
                case "+main":
                    window.SHOWMAIN = true;
                    FS.onRefresh();
                    break;
                case "-main":
                    window.SHOWMAIN = false;
                    FS.onRefresh();
                    break;
                case "+changelog":
                    fetch("CHANGELOG.txt?version=" + Math.floor(Math.random() * (100 - 1) + 1)).then(async (response) => {
                        await response.text().then(async (text) => {
                            await dialogMessage(marked.parse(text));
                        });
                    });
                    break;
                case "-debug":
                    REPL.DEBUG_CONSOLE_ON = false;
                    break;
                case "+debug":
                        REPL.DEBUG_CONSOLE_ON = true;
                        break;
                default:
                    break;
            }
            document.getElementById("IDRunBTN").disabled = false;
            return;
        }

        //if Cable attached check to see that the power switch is on.
        // if BLE make sure the voltage is high enough
        const voltage = await REPL.batteryVoltage();
        var image = '/images/XRP_Controller-Power.jpg'
        if(REPL.PROCESSOR == 2350){
            image = '/images/XRP-nonbeta-controller-power.jpg'
        }

        if(REPL.BLE_DEVICE == undefined){
            if(voltage < 0.45) {
                if(! await window.confirmMessage("The power switch on the XRP is not on. Motors and Servos will not work.<br>Turn on the switch before continuing." +
                    "<br><img src=" + image + " width=300>")) {
                    return;
                }
            }
        }else{
            if(voltage < 0.45) { //the device must be connected to a USB power with the power switch turned off.
                    if(! await window.confirmMessage("The power switch on the XRP is not on. Motors and Servos will not work.<br>Turn on the switch before continuing." +
                        "<br><img src==" + image + " width=300>")) {
                        return;
                    }
                
            }else if(voltage < 5.0) {
                if(await window.confirmMessage("<h1 style='text-align:center'>Low Battery Power! - Please Replace the Batteries</h1>" +
                    "<br><div  style='text-align:center'> <img src='/images/sad-battery.jpg' width=200></div>")) {
                    return;
                }
            }
        }

        //Disable anything that can't be clicked on while the program is running
        // document.getElementById('IDRunBTN').disabled = true;

        // show STOP button and hide RUN button when program is running
        document.getElementById('IDRunBTN').style.display = "none";
        document.getElementById('IDStopBTN').style.display = "block";
        
        addFSOverlay();
        disableMenuItems();

        //save all unsaved files [TODO] Do we always save the current editors program?
        for (const [id, editor] of Object.entries(EDITORS)) {
            if (!editor.SAVED_TO_THUMBY) {
                await editor.onSaveToThumby();
            }
        }
        var progressParent = document.getElementById("IDProgressBarParent");
        //await UIkit.modal(progressParent).show();
        document.getElementById("IdProgress_TitleText").innerText = "Running Program...";

        // update the main file so if they unplug the robot and turn it on it will execute this program.
        lines = await REPL.updateMainFile(editor.EDITOR_PATH); //replaces the lines with the main file.

        ATERM.TERM.scrollToBottom();
        //await UIkit.modal(progressParent).hide();
        await REPL.executeLines(lines);
        // document.getElementById('IDRunBTN').disabled = false;

        removeFSOverlay();
        enableMenuItems();
        
        // after code finishes running, show RUN button and hide STOP button
        document.getElementById("IDRunBTN").disabled = false;
        document.getElementById('IDRunBTN').style.display = "block";
        document.getElementById('IDStopBTN').style.display = "none";

        if(REPL.BLE_DEVICE == undefined){
            UIkit.modal(document.getElementById("IDWaitingParent")).hide(); //stop the spinner
        }

        if(REPL.RUN_ERROR && REPL.RUN_ERROR.includes("[Errno 2] ENOENT", 0)){
            await window.alertMessage("The program that you were trying to RUN has not been saved to this XRP.<br>To RUN this program save the file to XRP and click RUN again.");
        }

    }

    editor.onConvert = async (oldPath, data, ID) => {

        console.log('oldPath: ', oldPath); // tst

        if(REPL.DISCONNECT == true){
            window.alertMessage("This program can not be converted because no XRP is connected. Double-check that the XRP is connected before attempting to convert the program.");
            return;
        }
        if(REPL.BUSY) {
            window.alertMessage("Another program is already running. Stop that program first before attempting to convert your program.");
            return;
        }
            //move the file to trash
            //open a new file editor with a .py extension
            //force a save

        //oldPath = localStorage.getItem("activeTabFileName");

        await REPL.buildPath("/trash"); //make sure the trash directory is there.
        await REPL.renameFile(oldPath, "/trash" + oldPath);

        // //close the window
        var ed = EDITORS[ID];
        ed.closeThisEditor();
    /*
        ed.clearStorage();
        ed._container.close();
        delete EDITORS[ID];
    */
        //bring the focus back to the editors
        for (const [id] of Object.entries(EDITORS)) {
            var id1 = id;
            break;
            }
        EDITORS[id1]._container.focus();   //make sure the focus is on the editor section.
        var newFile = oldPath.replace(".blocks", ".py");
        var state = {};
        state.value = data;
        state.path = newFile;
        await myLayout.addComponent('Editor', state, 'Editor');
        //save the new file.
        for (const [id, ed] of Object.entries(EDITORS)) {
            if(ed.EDITOR_PATH == newFile){
                ed.onSaveToThumby();
            }
            }
    }

    editor.onDownloadFile = async () => {
        await downloadFileFromPath([editor.EDITOR_PATH]);
    }

    EDITORS[editor.ID] = editor;
}

// determine the last XRP configuration (Beta or Non-Beta) and setup the Blockly editor appropriately
// This check is re-done when an actual XRP is attached.
var xrpConfig = localStorage.getItem("xrpconfig");
if (xrpConfig != null && xrpConfig === "nonbeta"){
    //add non-beta blocks
    await configNonBeta();
}

// Register Golden layout panels
myLayout.registerComponentConstructor("Filesystem", registerFilesystem);
myLayout.registerComponentConstructor("Editor", registerEditor);
myLayout.registerComponentConstructor("Shell", registerShell);
//myLayout.registerComponentConstructor("Joy", registerJoy);
registerJoy();

// Restore from previous layout if it exists, otherwise default
var savedLayout = localStorage.getItem(layoutSaveKey);
if(savedLayout != null){
    console.log("Restored layout from previous state");
    myLayout.loadLayout(LayoutConfig.fromResolved(JSON.parse( savedLayout )));
}else{
    console.log("Restored layout to default state");
    myLayout.loadLayout(defaultConfig);
}


// Resize layout on browser window resize
window.addEventListener('resize', () => {
    console.log("Window and layout resized");
    myLayout.updateSize(window.width, window.height);
    localStorage.setItem(layoutSaveKey, JSON.stringify( myLayout.saveLayout() )); // Save layout to browser every time size/layout changes
});


// Save layout when a component is moved to a new position or one is closed
myLayout.on('stateChanged', function(stack){
    localStorage.setItem(layoutSaveKey, JSON.stringify( myLayout.saveLayout() )); // Save layout to browser every time size/layout changes
});


// Run through all editors and focus them since overflow text wrap will happen and make everything ugly.
// Editors should be the only panels with long enough names to cause this problem
for (const [id, editor] of Object.entries(EDITORS)) {
    editor._container.focus();
}


// Used to turn ASCII into hex string that is typical for Python
// https://stackoverflow.com/questions/33920230/how-to-convert-string-from-ascii-to-hexadecimal-in-javascript-or-jquery/33920309#33920309
// can use delim = '\\x' for Python like hex/byte string (fails for unicode characters)
String.prototype.convertToHex = function (delim) {
    return this.split("").map(function(c) {
        return ("0" + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(delim || "");
};


/**
 * Return the timestamp in fixed format
 * @returns {String}    Timestamp in format [YYYY-MM-DD HH:MM:SS]
 * @see https://stackoverflow.com/a/67705873
 */
function getTimestamp() {
    const pad = (n, s = 2) => (`${new Array(s).fill(0)}${n}`).slice(-s);
    const d = new Date();

    return `[${pad(d.getFullYear(), 4)}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}]`;
}

function disableMenuItems(){
    document.getElementById('IDViewCM').disabled = true;
    document.getElementById('IDFileUpload').disabled = true;
    document.getElementById('IDFileExport').disabled = true;
    document.getElementById('IDFileSave').disabled = true;
    document.getElementById('IDFileSaveAs').disabled = true;
}
window.disableMenuItems = disableMenuItems;

function enableMenuItems(){
    document.getElementById('IDViewCM').disabled = false;
    document.getElementById('IDFileUpload').disabled = false;
    document.getElementById('IDFileExport').disabled = false;
    document.getElementById('IDFileSave').disabled = false;
    document.getElementById('IDFileSaveAs').disabled = false;
}
window.enableMenuItems = enableMenuItems;

function getActiveId(){
    var foundId = 0;
    for (const [id, editor] of Object.entries(EDITORS)) {
        if(EDITORS[id]._container._tab._element.className.includes("lm_focused")){
            foundId = id;
            break;
        }
        else if(EDITORS[id]._container._tab.isActive) {
            foundId = id; //keep track of the Active ones just in case non are in focus
        }
    }
    
    //console.log("active is " + foundId);
    localStorage.setItem("activeTabId", foundId);
    if(EDITORS[foundId].isBlockly){
        document.getElementById("blockly_dropdown").style.display = "block"
        document.getElementById("micropython_dropdown").style.display = "none"
    }
    else{
        document.getElementById("blockly_dropdown").style.display = "none"
        document.getElementById("micropython_dropdown").style.display = "block"
    }
    return foundId;
}

async function alertMessage(message){
    await UIkit.modal.alert(message).then(function () {
        console.log('Alert closed.');
    });
}
window.alertMessage = alertMessage;

var CONFIRM  = false;

async function confirmMessage(message){
    await UIkit.modal.confirm(message)
    .then(function () {
        CONFIRM = true;
    }, function () {
        CONFIRM = false;
    });
    return CONFIRM;
}
window.confirmMessage = confirmMessage;

var val = "";
var ans = false;
async function promptMessage(message, input){
    await UIkit.modal.prompt(message, input).then(function (input) {
        val = input;
        ans = true;
    }, function () {
        ans = false;
        val = "";
    });
    return [ans,val];
}
window.promptMessage = promptMessage;

async function dialogMessage(message){

    let elm = document.createElement("div");
    elm.setAttribute("uk-modal","");
    let elm2 = document.createElement("div");
    elm2.classList = "uk-modal-dialog uk-margin-auto-vertical";
    elm.appendChild(elm2);

    let elm3 = document.createElement("button");
    elm3.classList = "uk-modal-close-default";
    elm3.setAttribute("uk-close","");
    elm2.appendChild(elm3);

    elm3 = document.createElement("div");
    elm3.classList = "uk-modal-body";
    elm3.setAttribute("uk-overflow-auto","");
    elm3.innerHTML = marked.parse(message);
    elm2.appendChild(elm3);
    await UIkit.modal(elm).show();
}

let BASE = window.location.pathname.replace(/\/$/,'');
if(BASE != ""){
    BASE += '/'
}

async function downloadFile(filePath) {
    let response = await fetch(BASE + filePath);

    if(response.status != 200) {
        throw new Error("Server Error");
    }

    // read response stream as text
    return await response.text();

}
window.downloadFile = downloadFile;


function downloadFileBytes(data, fileName){
    var a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";

    var blob = new Blob([new Uint8Array(data).buffer], {type: "octet/stream"});
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
window.downloadFileBytes = downloadFileBytes;


async function sleep(tenms){

    var tenmsCount = 0;

    while (true) {
        tenmsCount = tenmsCount + 1;
        if(tenmsCount >= tenms){
            return;
        }
        await new Promise(resolve => setTimeout(resolve, 10));
    }
}
window.sleep = sleep;
