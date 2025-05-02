// ##### Joystick_WRAPPER.js #####
// Wraps the joystick procedures into a class

class Joystick{


    joysticksArray = [
        0.0,
        0.0,
        0.0,
        0.0,
        0,
        0,
        0,
        0,
        0,
        0
    ]

    lastsentArray = [];

    joysticks = {
        x1: 0.0,
        y1: 0.0,
        x2: 0.0,
        y2: 0.0,
        bA: 0,
        bB: 0,
        bX: 0,
        bY: 0,
        bL: 0,
        bR: 0
    }
 
    //array indexes
    x1 = 0;
    y1 = 1;
    x2 = 2;
    y2 = 3;
    bA = 4;
    bB = 5;
    bX = 6;
    bY = 7;
    bL = 8;
    bR = 9;

    //keycodes being used
    left1 = 'KeyA';
    right1 = 'KeyD';
    up1 = 'KeyW';
    down1 = 'KeyS';
    left2 = 'KeyJ';
    right2 = 'KeyL';
    up2 = 'KeyI';
    down2 = 'KeyK';
    buttonA = 'Digit1';
    buttonB = 'Digit2';
    buttonX = 'Digit3';
    buttonY = 'Digit4';
    bumperL = 'Digit5';
    bumperR = 'Digit6';

    listening = false;

    sendPacket = false;

    controllerIndex = 0;

    // Define common objects used within this class right on object init
    // and open a terminal with addon to fit to parent HTML container
    constructor(_container, state){
        // Related to golden-layout
       
        /*
        this._container = _container;

        this.JOY_DIV = document.createElement("div");
        this.JOY_DIV.classList = "joy";
        var JOYBUTTON = document.createElement("button");
        JOYBUTTON.innerHTML = 'Send Info';
        this.JOY_DIV.appendChild(JOYBUTTON);
        var JOYBUTTON2 = document.createElement("button");
        JOYBUTTON2.innerHTML = 'Stop';
        this.JOY_DIV.appendChild(JOYBUTTON2);
        this._container.element.appendChild(this.JOY_DIV);

       JOYBUTTON.onclick = () => {
            this.startPackets();
        };

        JOYBUTTON2.onclick = () => {
            this.stopPackets();
        };

         // Make sure mouse click anywhere on panel focuses the panel
        this._container.element.addEventListener('click', (event) => {
            this._container.focus();
        });
        this._container.element.addEventListener('focusin', (event) => {
            this._container.focus();
        });

        */

        this.intervalID = undefined;
        this.sendAPacket = this.sendAPacket.bind(this);

        // ### CALLBACKS ###
        // Functions defined outside this module but used inside
        this.writeToDevice = undefined;
        this.startListening();
    }
    startPackets(){
        this.lastsentArray = this.joysticksArray.slice();
        this.startListening();
        this.listening = true;
        this.intervalID = setInterval(this.sendAPacket, 60);
    }

    stopPackets(){
        this.listening = false;
        if(this.intervalID != undefined){
            clearInterval(this.intervalID);
            this.intervalID = undefined;
        }
    }

    /**
 * Quantizes a float in the range [-1, 1] into an integer from 0 to 255.
 * For example:
 *   -1  -> 0
 *    0  -> ~127/128
 *    1  -> 255
 */
    quantizeFloat(value) {
        // Scale value from [-1,1] to [0,255]
        return Math.round((value + 1) * 127.5);
    }

    getChangedBytes(current, last, tolerance = 0.001) {
        const changes = [];
        for (let i = 0; i < current.length; i++) {
          // Only consider sending a change if the difference exceeds the tolerance
          if (Math.abs(current[i] - last[i]) > tolerance) {
            changes.push(i); // byte representing the array index
            changes.push(this.quantizeFloat(current[i])); // byte representing the new value
          }
        }
        const header = [0x55, changes.length];
        const results = new Uint8Array(header.length + changes.length);
        results.set(header);
        results.set(changes, header.length);
        return results;
      }

    async sendAPacket(){
        if(this.sendPacket){
            //if joystick then update the status before sending
            this.updateStatus();
            const sending = this.getChangedBytes(this.joysticksArray, this.lastsentArray);
            if(sending[1] > 0){
                await this.writeToDevice(sending); //(JSON.stringify(this.joysticks) + '\r');
            }
            this.lastsentArray = this.joysticksArray.slice();
        }
    }

    startMovement(keyCode){
        switch(keyCode) {
            case this.left1:
                this.joysticksArray[this.x1] = -1.0
                break;
            case this.right1:
                this.joysticksArray[this.x1] = 1.0
                break;
            case this.up1:
                this.joysticksArray[this.y1] = -1.0
                break;
            case this.down1:
                this.joysticksArray[this.y1] = 1.0
                break;
            case this.left2:
                this.joysticksArray[this.x2] = -1.0
                break;
            case this.right2:
                this.joysticksArray[this.x2] = 1.0
                break;
            case this.up2:
                this.joysticksArray[this.y2] = -1.0
                break;
            case this.down2:
                this.joysticksArray[this.y2] = 1.0
                break;
            case this.buttonA:
                this.joysticksArray[this.bA] = 1;
                break;
            case this.buttonB:
                this.joysticksArray[this.bB] = 1;
                break;
            case this.buttonX:
                this.joysticksArray[this.bX] = 1;
                break;
            case this.buttonY:
                this.joysticksArray[this.bY] = 1;
                break;
            case this.bumperL:
                this.joysticksArray[this.bL] = 1;
                break;
            case this.bumperR:
                this.joysticksArray[this.bR] = 1;
                break;
        }
    }
    stopMovement(keyCode){
        switch(keyCode) {
            case this.left1:
                this.joysticksArray[this.x1] = 0
                break;
            case this.right1:
                this.joysticksArray[this.x1] = 0
                break;
            case this.up1:
                this.joysticksArray[this.y1] = 0
                break;
            case this.down1:
                this.joysticksArray[this.y1] = 0
                break;
            case this.left2:
                this.joysticksArray[this.x2] = 0
                break;
            case this.right2:
                this.joysticksArray[this.x2] = 0
                break;
            case this.up2:
                this.joysticksArray[this.y2] = 0
                break;
            case this.down2:
                this.joysticksArray[this.y2] = 0
                break;
            case this.buttonA:
                this.joysticksArray[this.bA] = 0;
                break;
            case this.buttonB:
                this.joysticksArray[this.bB] = 0;
                break;
            case this.buttonX:
                this.joysticksArray[this.bX] = 0;
                break;
            case this.buttonY:
                this.joysticksArray[this.bY] = 0;
                break;
            case this.bumperL:
                this.joysticksArray[this.bL] = 0;
                break;
            case this.bumperR:
                this.joysticksArray[this.bR] = 0;
                break;
        }
    }

    updateStatus() {
        if (this.controllerIndex !== -1) {
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[this.controllerIndex];
            if (gamepad) {                
                // Assuming at least 4 axis
                this.joysticksArray[this.x1] = gamepad.axes[0];
                this.joysticksArray[this.y1] = gamepad.axes[1];
                this.joysticksArray[this.x2] = gamepad.axes[2];
                this.joysticksArray[this.y2] = gamepad.axes[3];
                
                // Assuming at least 6 Buttons
                this.joysticksArray[this.bA] =  gamepad.buttons[0].value;
                this.joysticksArray[this.bB] =  gamepad.buttons[1].value;
                this.joysticksArray[this.bX] =  gamepad.buttons[2].value;
                this.joysticksArray[this.bY] =  gamepad.buttons[3].value;
                this.joysticksArray[this.bL] =  gamepad.buttons[4].value;
                this.joysticksArray[this.bR] =  gamepad.buttons[5].value;

            }
        }
    }

    startJoyPackets(){
        this.startPackets();
        this.sendPacket = true;
    }

    stopJoyPackets(){
        this.stopPackets();
    }

    startListening(){
    // Event listener for keydown events
        document.addEventListener('keydown', (event) => {
            if(this.listening){
                //this.sendPacket = false;
                //event.preventDefault(); // Prevent default scroll behavior
                this.startMovement(event.code);
                //this.sendPacket = true;
            }
        });

        // Event listener for keyup events
        document.addEventListener('keyup', (event) => {
            if(this.listening){
                //this.sendPacket = false;
                //event.preventDefault(); // Prevent default scroll behavior
                this.stopMovement(event.code);
                //this.sendPacket = true;
            }
        });

        window.addEventListener("gamepadconnected", (event) => {
            this.controllerIndex = event.gamepad.index;
        });

        window.addEventListener("gamepaddisconnected", (event) => {
            if (this.controllerIndex === event.gamepad.index) {
                this.controllerIndex = -1;
            }
        });
    }
}
