/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();

        this.initKeys();

        return true;
    }

    addInterfaceElements() {
        // ---- Lights Configuration
        var lights_folder = this.gui.addFolder("Lights Configuration");

        for (let i = 0; i < this.scene.lights.length; i++) {
            // Checkbox for enabling/disabling lights
            lights_folder.add(this.scene.lights[i], 'enabled').name('Light ' + i + ' enabled').listen();
        }

        // ---- Cameras Configuration
        var camera_folder = this.gui.addFolder("Cameras Configuration");

        // Dropdown camera selection
        camera_folder.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Camera').onChange(this.scene.updateCamera.bind(this.scene)).listen();


        camera_folder.open();
    }

    /**
     * initKeys
     */
    initKeys() {
        this.scene.gui=this;
        this.processKeyboard=function(){};
        this.activeKeys={};
    }

    processKeyDown(event) {
        this.activeKeys[event.code]=true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code]=false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }
}