// ##### EDITOR_WRAPPER.js #####
// For managing multiple sessions/tabs of ace editors
// from one object exposed in main.js. Also exposes
// common operations provided by the ace editor

class EditorWrapper{
    constructor(_container, state, EDITORS){

        this.EDITORS = EDITORS;
        this._container = _container;

        // New editor, find a unique ID for it. At this point, a new editor can only
        // spawn on first page creation or button click, all or no editors should exist
        // by now
        this.ID = 0;
        if(state.id == -1 || state.id == undefined){
            while(this.ID in this.EDITORS){
                this.ID = this.ID + 1;
            }
            state.id = this.ID;
        }else{
            this.ID = state.id;
        }
        this.state = state;

        this.EDITORS[this.ID] = this;

        // Toolbar and editor div always exist, child elements are added or removed from them
        this.HEADER_TOOLBAR_DIV = document.createElement("div");
        //this.HEADER_TOOLBAR_DIV.classList.add("editor_header_toolbar");
        this.generateEditorHeaderToolbar();

        this.EDITOR_DIV = document.createElement("div");
        this.EDITOR_DIV.id = "IDEditorDiv" + this.ID;
        this.EDITOR_DIV.classList.add("editor");
        this._container.element.appendChild(this.EDITOR_DIV);

        this.ERROR_DIV = document.createElement("div");
        this.ERROR_DIV.style.position = "absolute";
        this.ERROR_DIV.innerHTML = "The code in this program will not work on a Beta board.";

        this.defaultCode =   "from XRPLib.defaults import *\n\n" +
                             "# available variables from defaults: left_motor, right_motor, drivetrain,\n" +
                             "#      imu, rangefinder, reflectance, servo_one, board, webserver\n" +
                             "# Write your code Here\n";

        // If this is the first time loading the website (with the default
        // GoldenLayout setup), load a choice selector between MicroPython
        // and Blockly.
        if(state["value"] == undefined && state.choose){
            this.setTitle("Choose Mode");
            // this.HEADER_TOOLBAR_DIV.innerHTML = "Please choose your Editor preference:";

            const clone = document.querySelector('#new-file');

            const template = clone.cloneNode(true);
            template.removeAttribute('id');

            template.style.display = "block";
            this.EDITOR_DIV.appendChild(template);
            const pUser = localStorage.getItem("projUser");
            var users = [];
            if(REPL.DISCONNECT == true){
                users.push(pUser);
            }else {
                users = FS.getUsers();
            }

            const userDropdown = template.querySelector("#user-dropdown");
            const projectNameInput = template.querySelector("#file-name");
            const createButton = template.querySelector("#create-btn");
            const micropythonIcon = template.querySelector("#micropython");
            const blocklyIcon = template.querySelector("#blockly");
            let selectedPlatform = "";

            updateDropdown(pUser);

            function updateDropdown(newUser = null) {
                userDropdown.innerHTML = users.map(user => `<option value="${user}">${user}</option>`).join('');

                if(newUser){
                    userDropdown.value = newUser;
                }
            }

            template.querySelector("#add-user-btn").onclick = async () =>  {
                var [ans, newUser] = await window.promptMessage("Enter new user name","");
                if (ans) {
                    users.push(newUser);
                    updateDropdown(newUser);
                }
            };

            function updateCreateButtonState() {
                const projectName = projectNameInput.value.trim();
                const isUserSelected = userDropdown.value;
                createButton.disabled = !(projectName && selectedPlatform && isUserSelected);
            }

            projectNameInput.addEventListener("input", updateCreateButtonState);

            const selectPlatform = (platform) => {
                selectedPlatform = platform;
                micropythonIcon.classList.toggle("platform-icon-highlighted", platform === "micropython");
                blocklyIcon.classList.toggle("platform-icon-highlighted", platform === "blockly");
                updateCreateButtonState();
            }

            micropythonIcon.onclick =  () => {selectPlatform("micropython")};
            blocklyIcon.onclick =  () => selectPlatform("blockly");
            
            template.querySelector("#create-btn").onclick = async () => {
                const user = userDropdown.value;
                const projName = projectNameInput.value;
                
                localStorage.setItem("projUser", user);
                //await REPL.buildPath("/" + user); //make sure the path exists so it will show in the filesystem window

                this.EDITOR_PATH = '/' + user + '/' + projName;
                if(selectedPlatform === "blockly"){
                    this.EDITOR_PATH += ".blocks";
                    localStorage.setItem("isBlockly" + this.ID, true);      
                } else{
                    this.EDITOR_PATH += ".py";
                    localStorage.setItem("isBlockly" + this.ID, false);  
                }
                localStorage.setItem("EditorTitle" + this.ID, "Editor" + this.ID + ' - ' + this.EDITOR_PATH);
                localStorage.setItem("EditorPath" + this.ID, this.EDITOR_PATH);
                this.initEditorPanelUI(state["value"]);

                this.onSaveToThumby();
            }


            
            var blockly_button = document.createElement("button");
            blockly_button.classList = "uk-button uk-button-secondary uk-width-1-2 uk-height-1-1 uk-text-small";
            blockly_button.innerHTML = '<img src="images/blockly.svg" class="uk-width-1-2"/><div><p>BLOCKLY</p><p>(visual block editor)<p/></div>';
            blockly_button.title = "Load a Blockly Editor for visual block-based coding.";
            //this.EDITOR_DIV.appendChild(blockly_button);

            var micropython_button = document.createElement("button");
            micropython_button.classList = "uk-button uk-button-secondary uk-width-1-2 uk-height-1-1 uk-text-small";
            micropython_button.innerHTML = '<img src="images/micropython.png" class="micropython-icon"/><div class="micropython-text"><p>MICRO PYTHON</p><p>(text code editor)</p></div>';
            micropython_button.title = "Load a MicroPython Editor for normal text-based coding.";
            //this.EDITOR_DIV.appendChild(micropython_button);

            const cleanUp = ()=>{
                localStorage.removeItem("EditorTitle" + this.ID);
            };
            micropython_button.onclick = () => {
                cleanUp();
                this.initEditorPanelUI(state["value"]);
            };
            blockly_button.onclick = () => {
                cleanUp();
                this.state['isBlockly'] = true;
                this.initEditorPanelUI(state["value"]);
            };
        }else{
            const path = state["path"]
            if(path != undefined && path.endsWith(".blocks")){
                this.state['isBlockly'] = true;
            }
            this.initEditorPanelUI(state["value"]);
        }

        // Listen for layout changes and re-fit the editor, also override the default exit button
        this._container._layoutManager.on('stateChanged', () => {
            this.resize();

            // https://github.com/golden-layout/golden-layout/issues/324
            // Remove editor close button functionality and override it
            var oldElem = this._container._tab._closeElement;

            this._container._tab._element.title = this.EDITOR_TITLE.split(" - ")[1];

            if(oldElem != null && oldElem.parentNode != null){
                var newElem = oldElem.cloneNode(true);
                oldElem.parentNode.replaceChild(newElem, oldElem);

                 newElem.onclick = async () =>  {
                    if(this.SAVED_TO_THUMBY == false && ! await window.confirmMessage('You have unsaved changes. Are you sure you want to close this editor?')) {
                        return;
                    }

                    this.closeThisEditor();

                }
            }
        });

        // Used for setting the active editor outside this module, typically for bit map builder
        // these methods are in main.js
        this.onFocus = undefined;
        this.onSaveToThumby = undefined;
        this.onUploadFiles = undefined;
        this.onSaveAsToThumby = undefined;
        this.onFastExecute = undefined;
        this.onEmulate = undefined;
        this.onOpen = undefined;
        this.onConvert = undefined;
        this.onDownloadFile = undefined;
        this.addNewEditor = undefined;

        // Make sure mouse down anywhere on panel focuses the panel
        // Mouse down is used so New Tab, Open Python, etc can allow the focus out.
        this._container.element.addEventListener('mousedown', (event) => {
            this._container.focus();
            this.onFocus();
        });
        this._container.element.addEventListener('focusin', (event) => {
            this._container.focus();
            this.onFocus();

        });

        // Used to suggest a name for certain operations
        this.FILE_OPTIONS = {
            suggestedName: ".py",
        };

        this.state = {};
        this.state.id = this.ID;
        this._container.setState(this.state);
    }

    generateEditorHeaderToolbar() {
        this.HEADER_TOOLBAR_DIV = document.getElementById("editor_header_toolbar");
    }

    runXRPCode() {
        //let id = localStorage.getItem("activeTabId");
        this.onFastExecute(this.getValue());
    }

    async closeThisEditor(){
        // Remove this since only needed for editor
        window.removeEventListener("resize", this.windowResizeListener);

        if(Object.keys(this.EDITORS).length == 1){      //this is the last editor, so open the choose file
            this._container.parent.focus();
            await this.addNewEditor();
        }

        delete this.EDITORS[this.ID];
        this.clearStorage();

        //console.log("Cleared info for Editor: " + this._container.title);

        this._container.close();
    }

    initEditorPanelUI(data) {
        this.makeBlocklyPythonHeaderOptions();

        var isBlockly = localStorage.getItem("isBlockly" + this.ID) || this.state.isBlockly;

        // WHEN A USER CREATES A NEW TAB, THE FOLLOWING WILL SET THE EDITOR TO BLOCKLY OR MICROPYTHON SETTINGS
        if(data == undefined && (isBlockly == "true" || isBlockly == true)) {
            console.log("INIT BLOCKLY VIEWER");
            localStorage.setItem("isBlockly" + this.ID, true);
            this.turnIntoBlocklyViewer(data);
        }else if(data == undefined){    // No data and not Blockly, new editor with default code
            console.log("INIT CODE VIEWER");
            localStorage.setItem("isBlockly" + this.ID, false);
            this.turnIntoCodeViewer(data);
        }else if(data != undefined){
            // Check if the decoded data contains binary replacement letters (could also check that most characters only equal ascii chars)
            var text = typeof data == "string" ? data : new TextDecoder().decode(new Uint8Array(data));
            //We know there is data, so save it to the localstorage for this editor ID
            localStorage.setItem("EditorValue"+this.ID, text);
            //if(text && text.startsWith("{") && text.indexOf('{"blocks":{"') != -1){
            if(isBlockly){
                console.log("INIT BLOCKLY VIEWER");
                localStorage.setItem("isBlockly" + this.ID, true);
                if(this.SAVED_TO_THUMBY == undefined){
                    localStorage.setItem("EditorSavedToThumby" + this.ID, true); //it already had text so must be coming from the XRP so already saved
                    this.SAVED_TO_THUMBY = true;
                }

                this.turnIntoBlocklyViewer(text);
            }else{
                console.log("INIT CODE VIEWER");
                localStorage.setItem("isBlockly" + this.ID, false);
                if(this.SAVED_TO_THUMBY == undefined){
                    localStorage.setItem("EditorSavedToThumby" + this.ID, true); //it already had text so must be coming from the XRP so already saved
                    this.SAVED_TO_THUMBY = true;
                }
                this.turnIntoCodeViewer(text);
            }
        }

        // Figure out if editor should take on the last saved title, passed title, or default title
        var lastEditorTitle = localStorage.getItem("EditorTitle" + this.ID);
        if(lastEditorTitle != null){
            this.setTitle(lastEditorTitle);
        }else if(this.state['path'] != undefined){
            this.setTitle('Editor' + this.ID + ' - ' + this.state['path']);
            this.SAVED_TO_THUMBY = true;         // Just opened from thumby, so saved to it
        }else{
            this.setTitle("Editor" + this.ID + ' - ' + this.EDITOR_PATH);
            this.SAVED_TO_THUMBY = undefined;    // For sure not saved to Thumby but also new, keep undefined so can be closed without alert
        }


        // Figure out editor should set the path from last saved, or passed
        var lastEditorPath = localStorage.getItem("EditorPath" + this.ID);
        if(lastEditorPath != null){
            this.EDITOR_PATH = lastEditorPath;
        }else if(this.state['path'] != undefined){
            this.setPath(this.state['path']);
        }


        // Figure out if editor was saved last time or not
        var lastEditorSavedToThumby = localStorage.getItem("EditorSavedToThumby" + this.ID);
        if(lastEditorSavedToThumby != null){
            this.SAVED_TO_THUMBY = (lastEditorSavedToThumby === 'true');
        }
        this.setTitle(this.EDITOR_TITLE); //call again to set the modified icon
    }

    makeBlocklyPythonHeaderOptions() {
         // Make the editor area
         if (!this.BLOCKLY_DIV) {
            this.BLOCKLY_DIV = document.createElement("div");
            this.BLOCKLY_DIV.style.position = "absolute";
        }
        this.EDITOR_DIV.appendChild(this.BLOCKLY_DIV);
    }

    turnIntoBlocklyViewer(data) {
        localStorage.setItem("activeTabId", this.ID);
        localStorage.setItem("activeTabFileType", "blockly");
        // hide micropython dropdown options since this is a blockly file
        document.getElementById("micropython_dropdown").style.display = "none";
        document.getElementById("blockly_dropdown").style.display = "inline-block";

        this.isBlockly = true;
        if (this.ACE_EDITOR) this.ACE_EDITOR.destroy();

        if(this.BLOCKLY_WORKSPACE && data != undefined){
            console.log("loaded workspace early notice");
            this.LOADING_BLOCKLY = true; //let the onchange event know that we are loading
            try{
                Blockly.serialization.workspaces.load(JSON.parse(data), this.BLOCKLY_WORKSPACE);
            }
            catch{
                console.log("blockly load failed turnIntoBlocklyViewer")
            }
        }

        // This must run after the Editor is added to the DOM document
        // otherwise Blockly will refuse to initialise itself.
        this._container.addEventListener("show", ()=>{this.setupBlockly(data)});
        if(document.body.contains(this.BLOCKLY_DIV)){
            this.setupBlockly(data);
        }
    }

    setupBlockly(data) {

        if (!this.BLOCKLY_WORKSPACE) {

            this.BLOCKLY_WORKSPACE = Blockly.inject(this.BLOCKLY_DIV,{
                toolbox: blocklyToolbox,
                move:{
                    scrollbars: {horizontal: true, vertical: true},
                    drag: true,
                    wheel: true},
                zoom:{controls: true, wheel: false,
                    startScale: 1, maxScale: 1, minScale: 0.1, scaleSpeed: 1.2,
                pinch: false},
                trashcan: true
            });

            // Saving of editor state
            this.BLOCKLY_WORKSPACE.addChangeListener((e)=>{
                if(e.type == Blockly.Events.FINISHED_LOADING){
                    this.LOADING_BLOCKLY = false;
                    return;
                }
                if(this.LOADING_BLOCKLY){return}
                if(e.type == Blockly.Events.VIEWPORT_CHANGE || e.isUiEvent){return}
                localStorage.setItem("EditorValue" + this.ID, JSON.stringify(
                    Blockly.serialization.workspaces.save(this.BLOCKLY_WORKSPACE)));
                if(this.SAVED_TO_THUMBY == true || this.SAVED_TO_THUMBY == undefined){
                    if(this.EDITOR_PATH != undefined){
                        this.setTitle("Editor" + this.ID + ' - *' + this.EDITOR_PATH);
                    }else{
                        this.setTitle("*Editor" + this.ID);
                    }

                    this.SAVED_TO_THUMBY = false;
                    localStorage.setItem("EditorSavedToThumby" + this.ID, this.SAVED_TO_THUMBY);
                    this.setTitle(this.EDITOR_TITLE); //call again to set the modified icon
                }
            });

            //blocklyRegister(this.BLOCKLY_WORKSPACE);
            // Ctrl+s / Cmd+s (Save)
            this.BLOCKLY_DIV.onkeydown = (e) => {
              if((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
                  && e.keyCode == 83) {
                //let id = localStorage.getItem("activeTabId");
                this.onSaveToThumby();
                //console.log("Saving File for Tab Id: ", id);
                e.preventDefault();
              }
            };
            this.BLOCKLY_WORKSPACE.onSaveToThumby = this.onSaveToThumby;

            // Restoring of editor state
            var lastEditorValue = localStorage.getItem("EditorValue" + this.ID);
            if(data != undefined || lastEditorValue != null){ 
                var data2 = data;
                if(data == undefined){
                    data2 = lastEditorValue;
                }
                this.LOADING_BLOCKLY = true; //let the onchange event know that we are loading
                try{
                    Blockly.serialization.workspaces.load(JSON.parse(data2), this.BLOCKLY_WORKSPACE);
                }
                catch(e){
                    //console.log(e);
                    this.EDITOR_DIV.replaceChild(this.ERROR_DIV, this.EDITOR_DIV.childNodes[0]);
                }
            }else{
                if(this.EDITOR_PATH == undefined){
                    // When adding default editors, give them a path but make each unique by looking at all other open editors
                    this.setPath("/untitled-" + this.ID + ".blocks");
                    this.setTitle("Editor" + this.ID + ' - *' + this.EDITOR_PATH);
                }
            }
            // Ensure all Blockly editors have a path set. Let's keep it simple for the <3n00bs<3
        }
        this.resize();
        this.BLOCKLY_WORKSPACE.zoomToFit();
        this.BLOCKLY_WORKSPACE.scrollCenter();

    }

    turnIntoCodeViewer(data){

        // Listen for window resize event and re-fit terminal
        this.windowResizeListener = window.addEventListener('resize', this.resize.bind(this));

        // Init the ace editor
        this.ACE_EDITOR = ace.edit(this.EDITOR_DIV);

        this.ACE_EDITOR.session.setMode("ace/mode/python");
        this.ACE_EDITOR.setKeyboardHandler("ace/keyboard/vscode");

        localStorage.setItem("activeTabId", this.ID);
        localStorage.setItem("activeTabFileType", "micropython");
        // hide micropython dropdown options since this is a blockly file
        document.getElementById("blockly_dropdown").style.display = "none";
        document.getElementById("micropython_dropdown").style.display = "inline-block";

        this.setThemeDark();

        this.resize();

        this.INSERT_RESTORE = false;

        // Save value when changes made and edit the title
        this.ACE_EDITOR.session.on('change', (event) => {
            localStorage.setItem("EditorValue" + this.ID, this.ACE_EDITOR.getValue());

            // The first change is always an insert, don't change saved  to thumby flag for first change
            if(this.INSERT_RESTORE == true){
                if(this.SAVED_TO_THUMBY == true || this.SAVED_TO_THUMBY == undefined){
                    if(this.EDITOR_PATH != undefined){
                        this.setTitle("Editor" + this.ID + ' - ' + this.EDITOR_PATH);
                    }else{
                        this.setTitle("*Editor" + this.ID);
                    }
                    this.SAVED_TO_THUMBY = false;
                    localStorage.setItem("EditorSavedToThumby" + this.ID, this.SAVED_TO_THUMBY);
                    this.setTitle(this.EDITOR_TITLE); //call again to set the modified icon
                }
            }else{
                this.INSERT_RESTORE = true;
            }
        });


        // Figure out if the editor should take on stored code, passed, code, or use default code
        var lastEditorValue = localStorage.getItem("EditorValue" + this.ID);
        if(data != undefined){
            this.ACE_EDITOR.setValue(data, 1);
        }else if(lastEditorValue != null){
            this.ACE_EDITOR.setValue(lastEditorValue, 1);
        }else{
            this.ACE_EDITOR.setValue(this.defaultCode, 1);
            if(this.EDITOR_PATH == undefined){
                this.setPath("/untitled-" + this.ID + ".py");
                this.setTitle("Editor" + this.ID + ' - ' + this.EDITOR_PATH);
            }
        }

        // Make it so you can't undo the code paste into the editor
        this.ACE_EDITOR.session.getUndoManager().reset();

        // Set the font size based on what's saved, if it exists
        var lastEditorFontSize = localStorage.getItem("EditorFontSize" + this.ID);
        this.FONT_SIZE = 10;
        if(lastEditorFontSize != null){
            this.FONT_SIZE = lastEditorFontSize;
        }

        // Get live autocomplete state, affects all editors
        this.AUTOCOMPLETE_STATE = localStorage.getItem("EditorAutocompleteState");
        if(this.AUTOCOMPLETE_STATE == undefined){ 
            this.AUTOCOMPLETE_STATE = false;  //if no state then off by default.
        }
        this.setAutocompleteButtonText();

        // Set the options that were restored
        this.ACE_EDITOR.setOptions({
            fontSize: this.FONT_SIZE.toString() + "pt",
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: this.AUTOCOMPLETE_STATE,
            enableSnippets: true
        });

        // When the editor has focus capture ctrl-s and do save file function
        this.ACE_EDITOR.commands.addCommand({
            name: 'SaveCurrentTab',
            bindKey: {win: 'Ctrl-S',  mac: 'Command-S'},
            exec: () => {
                //let id = localStorage.getItem("activeTabId");
                this.onSaveToThumby();
                //console.log('Saving File for Tab Id: ', id);
            },
            readOnly: true
        });
    }

    checkAllEditorsForPath(path){
        for(const [editorID, editorWrapper] of Object.entries(this.EDITORS)){
            if(editorWrapper.EDITOR_PATH != undefined
                && editorWrapper.EDITOR_PATH.replace(/\.blocks$/, '.py') == path.replace(/\.blocks$/, '.py')
                && editorWrapper.ID != this.ID){
                return true;
            }
        }
        return false;
    }

    // Need special function for this since constructor would come before onOpen def
    useOnOpen() {
        this.onOpen(this);
    }

    setAutocompleteButtonText(){
        if(this.AUTOCOMPLETE_STATE){
            document.getElementById("IDViewAutoComplete").textContent = "Turn live autocomplete OFF";
        }else{
            document.getElementById("IDViewAutoComplete").textContent = "Turn live autocomplete ON";
        }
    }

    setAutocompleteState(state){
        this.ACE_EDITOR.setOptions({
            enableLiveAutocompletion: state,
            enableSnippets: state
        });
        this.AUTOCOMPLETE_STATE = state;
        this.setAutocompleteButtonText();
    }

    toggleAutocompleteStateForAll(){
        if(this.AUTOCOMPLETE_STATE){
            this.AUTOCOMPLETE_STATE = false;
        }else{
            this.AUTOCOMPLETE_STATE = true;
        }

        localStorage.setItem("EditorAutocompleteState", this.AUTOCOMPLETE_STATE);

        // Apply to all editors, even this one
        //[TODO] This should proably only apply to this editor since that is the way fonts work
        for (const [id, editor] of Object.entries(this.EDITORS)) {
            if(!editor.isBlockly) {
                editor.setAutocompleteState(this.AUTOCOMPLETE_STATE);
            }
        }
    }

    setPath(path){
        this.EDITOR_PATH = path;
        localStorage.setItem("EditorPath" + this.ID, this.EDITOR_PATH);
        this.setTitle("Editor" + this.ID + ' - ' + this.EDITOR_PATH);
    }

    compiledPath(){
        if(this.isBlockly){
            return this.EDITOR_PATH.replace(/\.blocks$/, '.py')
        }
        return this.EDITOR_PATH;
    }

    setSaved(){
        this.SAVED_TO_THUMBY = true;
        localStorage.setItem("EditorSavedToThumby" + this.ID, this.SAVED_TO_THUMBY);
    }

    updateTitleSaved(){
        if(this.SAVED_TO_THUMBY == true){
            if(this.EDITOR_PATH != undefined){
                this.setTitle("Editor" + this.ID + ' - ' + this.EDITOR_PATH);
            }else{
                this.setTitle("Editor" + this.ID);
            }
            localStorage.setItem("EditorSavedToThumby" + this.ID, this.SAVED_TO_THUMBY);
        }
    }


    setThemeLight() {
        localStorage.setItem("lastTheme", "light"); // set theme to light
        if(this.ACE_EDITOR){
            this.ACE_EDITOR.setTheme("ace/theme/chrome");
        }
    }

    setThemeDark() {
        localStorage.setItem("lastTheme", "dark"); // set theme to dark
        if(this.ACE_EDITOR){
            this.ACE_EDITOR.setTheme("ace/theme/tomorrow_night_bright");
        }
    }

    setTheme(theme){
        if(this.ACE_EDITOR){
            this.ACE_EDITOR.setTheme(`ace/theme/${theme}`);
        }
    }

    setTitle(title){
        var t = title.split('/').at(-1);
        if(!this.SAVED_TO_THUMBY){
            t = t + " \u2022";
        }
        this._container.setTitle(t);

        // Make the tab title show the full path
        if(this._container._tab != undefined){
            this._container._tab._element.title = this.EDITOR_TITLE.split(" - ")[1];
        }

        this.EDITOR_TITLE = title;
        localStorage.setItem("EditorTitle" + this.ID, title);
    }


    // Needs to be called when editor closed otherwise edits that are spawned again will take on the stored data
    clearStorage(){
        console.log("Removed editor local storage");
        localStorage.removeItem("EditorEMUCheck" + this.ID);
        localStorage.removeItem("EditorValue" + this.ID);
        localStorage.removeItem("EditorTitle" + this.ID);
        localStorage.removeItem("EditorPath" + this.ID);
        localStorage.removeItem("EditorFontSize" + this.ID);
        localStorage.removeItem("EditorSavedToThumby" + this.ID);
        localStorage.removeItem("isBlockly" + this.ID);
    }


    async resize(){
        if(this.ACE_EDITOR != undefined) this.ACE_EDITOR.resize();

        if(this.isBlockly && this.BLOCKLY_WORKSPACE){
            // Position blocklyDiv over blocklyArea.
            if(this.EDITOR_DIV.clientWidth){
                this.BLOCKLY_DIV.style.width = this.EDITOR_DIV.clientWidth + 'px';
            }
            if(this.EDITOR_DIV.clientHeight){
                this.BLOCKLY_DIV.style.height = this.EDITOR_DIV.clientHeight + 'px';
            }
          Blockly.svgResize(this.BLOCKLY_WORKSPACE);
        }
    }


    increaseFontSize(){
        this.FONT_SIZE++;
        this.ACE_EDITOR.setOptions({
            fontSize: this.FONT_SIZE.toString() + "pt",
        });
        localStorage.setItem("EditorFontSize" + this.ID, this.FONT_SIZE);
    }
    decreaseFontSize(){
        if(this.FONT_SIZE - 1 > 0){
            this.FONT_SIZE--;
            this.ACE_EDITOR.setOptions({
                fontSize: this.FONT_SIZE.toString() + "pt",
            });
            localStorage.setItem("EditorFontSize" + this.ID, this.FONT_SIZE);
        }
    }
    resetFontSize(){
        this.FONT_SIZE = 10;
        this.ACE_EDITOR.setOptions({
            fontSize: this.FONT_SIZE.toString() + "pt",
        });
        localStorage.setItem("EditorFontSize" + this.ID, this.FONT_SIZE);
    }


    async openFileContents(contents){
        if(this.SAVED_TO_THUMBY == false && ! await window.confirmMessage('You have unsaved changes. Are you sure you want to overwrite this editor?')) {
            return;
        }
        this.ACE_EDITOR.setValue(contents, 1);
    }


    // Opens a new tab with contents of local file from PC
    async openFile(){
        if(this.SAVED_TO_THUMBY == false && ! await window.confirmMessage('You have unsaved changes. Are you sure you want to overwrite this editor?')) {
            return;
        }

        let fileHandle;
        try{
            [fileHandle] = await window.showOpenFilePicker(this.FILE_OPTIONS);
        }catch(err){
            return;
        }

        const file = await fileHandle.getFile();
        var data = await file.arrayBuffer();

        this.CURRENT_FILE_NAME = file.name;

        this.SAVED_TO_THUMBY = false;
        localStorage.setItem("EditorSavedToThumby" + this.ID, false); //We just imported from the PC, so not saved yet.

        this.initEditorPanelUI(data);

        // Make sure the hover title is set
        this.setTitle("Editor" + this.ID + ' - ' + this.EDITOR_PATH);

        return file.name;
    }



    // Block data as a JSON string, or null
    getBlockData(){
        if(!this.isBlockly){
          return null;
        }
        return JSON.stringify(Blockly.serialization.workspaces.save(this.BLOCKLY_WORKSPACE));
    }

    // Fix anything Blockly did that wouldn't work for MicroPython
    blockly_fix_for_micropython(code){
        return code.replace("from numbers import Number\n", "Number = int\n");
    }

    // Expose common Ace editor operation
    getValue(){
        if(this.isBlockly){
            return (this.blockly_fix_for_micropython(
                  Blockly.Python.workspaceToCode(this.BLOCKLY_WORKSPACE))
                   );
        }else{
            return this.ACE_EDITOR.getValue();
        }
    }

    // Expose common Ace editor operation
    setValue(value, index){
        return this.ACE_EDITOR.setValue(value, index);
    }

    // Wrapper for the ACE editor insert function, used for exporting custom bitmaps to editor
    insert(str){
        if(this.isBlockly){
            const sel = Blockly.getSelected();
            if(sel && (sel.type == 'load_sprite' || sel.type == 'load_anim_sprite')){
                sel.data = str;
                // Save the changed state of the workspace
                localStorage.setItem("EditorValue" + this.ID, JSON.stringify(
                    Blockly.serialization.workspaces.save(this.BLOCKLY_WORKSPACE)));
                updateImageFromSprite(sel);
            }
            else{
                alert("Please select a [load sprite] block.")
            }
        }else{
            this.ACE_EDITOR.insert(str);
        }
    }

    // Wrapper for ACE editor getSelectedText function, used for getting custom bitmaps from editor
    getSelectedText(){
        if(this.isBlockly){
            const sel = Blockly.getSelected();
            return (sel && (sel.type == 'load_sprite' || sel.type == 'load_anim_sprite') ? sel.data : "NO BLOCK");
        }else{
            return this.ACE_EDITOR.getSelectedText();
        }
    };

}
