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
        this.gui.add(this.scene, 'selectedDimension', dimensions).name('Board dimensions');

        // Game modes
        let modes = Object.values(MyGameOrchestrator.modes)
        this.gui.add(this.scene, 'selectedGamemode', modes).name('Game mode');
    
        // Game difficulties
        let difficulties = Object.values(MyGameOrchestrator.difficulties)
        this.gui.add(this.scene, 'selectedDifficulty', difficulties).name('Game difficulty');
    
        this.gui.add(this.scene, "newGame").name("New Game");

        this.game_options();

        // ---- Cameras Configuration
        var camera_folder = this.gui.addFolder("Cameras Configuration");

        // Dropdown camera selection
        camera_folder.add(this.scene, 'selectedCamera', this.scene.cameraIDs).name('Camera').onChange(this.scene.updateCamera.bind(this.scene)).listen();


        camera_folder.open();

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
        this.gui.add(this.scene, 'selectedTheme', {'Home' : 0, 'Test' : 1})
                .name('Theme ')
                .onChange(this.scene.changeTheme.bind(this.scene));
    }
}