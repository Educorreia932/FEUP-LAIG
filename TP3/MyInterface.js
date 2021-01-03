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

        this.hasElements = false;

        return true;
    }

    addInterfaceElements() {
        if(this.hasElements) return;

        // Board dimensions
        let dimensions = Object.values(MyGameOrchestrator.dimensions)
        this.gui.add(this.scene, 'selectedDimension', dimensions).name('Board Dimensions');

        // Game modes
        let modes = Object.values(MyGameOrchestrator.modes)
        this.gui.add(this.scene, 'selectedGamemode', modes).name('Game Mode');
    
        // Game difficulties
        let difficulties = Object.values(MyGameOrchestrator.difficulties)
        this.gui.add(this.scene, 'selectedDifficulty', difficulties).name('Game Difficulty');
    
        this.gui.add(this.scene, "newGame").name("New Game");

        this.gui.add(this.scene, "undo").name("Undo"); 

        this.gui.add(this.scene, "playMovie").name("Play Movie");

        this.gui.add(this.scene.gameOrchestrator, "timeout", 5, 120, 1).name("Timeout");

        this.game_options();

        // ---- Cameras Configuration
        var camera_folder = this.gui.addFolder("Cameras Configuration");

        // Dropdown camera selection
        camera_folder.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Camera').onChange(this.scene.updateCamera.bind(this.scene)).listen();


        camera_folder.open();

        // ---- Lights Configuration
        var lights_folder = this.gui.addFolder("Lights Configuration");
        
        lights_folder.add(this.scene, 'displayLights').name('Display Lights').onChange(this.scene.toggleDisplayLights.bind(this.scene)).listen();

        for (let i = 0; i < this.scene.lights.length; i++) {
            // Checkbox for enabling/disabling lights
            lights_folder.add(this.scene.lights[i], 'enabled').name('Light ' + this.scene.lightIDs[i]).listen();
        }

        this.hasElements = true;
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

    /** Theme Changing */
    game_options() {
        this.gui.add(this.scene, 'selectedTheme', {'Home' : 0, 'Tatooine' : 1})
                .name('Theme ')
                .onChange(this.scene.changeTheme.bind(this.scene));
    }
}