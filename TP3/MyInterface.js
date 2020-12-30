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
        // TODO: Add scene selection

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

        // TODO: this.gui.add(this.scene, "undo").name("Undo"); 
        // TODO: this.gui.add(this.scene, "undo").name("Play Movie");
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