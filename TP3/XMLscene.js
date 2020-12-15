/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.displayLights = false; // Checkbox for drawing lights or not
        // List to store the ID of the cameras read on parser, to be displayed on the GUI
        this.cameraIDs = [];
        this.selectedCamera = null;

        // Stack to store materials and textures being applied
        this.textureStack = [];
        this.materialStack = [];

        // Pre Init a default camera before parsing the XML (required due to Application implementation)
        this.preInitCamera();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;

        this.defaultAppearance = new CGFappearance(this);

        // Enable picking
		this.setPickEnabled(true);
    }

    // Texture & Material Stack Control
    pushTexture(texture) {
        this.textureStack.push(texture);

        var material = this.getMaterial();
        if (material != null) {material.setTexture(texture);material.apply();}
        else {this.defaultAppearance.setTexture(texture);this.defaultAppearance.apply();}
    }

    popTexture() {
        var aux = this.textureStack.pop();
        var current = this.getTexture();

        var material = this.getMaterial();
        if (material != null) {material.setTexture(current); material.apply()}
        else {this.defaultAppearance.setTexture(current);this.defaultAppearance.apply();}

        return aux;
    }

    getTexture() {
        return (this.textureStack.length <= 0 ? null : this.textureStack[this.textureStack.length - 1]);
    }

    pushMaterial(material) {
        var texture = this.getTexture();
        this.materialStack.push(material);
        material.setTexture(texture);
        material.apply();
    }

    popMaterial() {
        var texture = this.getTexture();
        var aux = this.materialStack.pop();
        var current = this.getMaterial();
        if (current != null) {current.setTexture(texture);current.apply();}
        else {this.defaultAppearance.setTexture(texture); this.defaultAppearance.apply();}
        return aux;
    }

    getMaterial() {
        return (this.materialStack.length <= 0 ? null : this.materialStack[this.materialStack.length - 1]);
    }

    preInitCamera() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
    }

    update(time) {
        if (this.sceneInited)
            this.graph.updateAnimations((time - this.firstFrame) / 1000.0);
    }

    /**
     * Initializes the scene cameras.
     * Sets the default camera read from the XML and stores the IDs of the cameras defined on the XML
     */
    initCameras() {
        // Read the default camera
        this.selectedCamera = this.graph.defaultCamera;

        // Read the IDs of the cameras defined
        this.cameraIDs = Object.keys(this.graph.cameras);

        // Set the default camera
        this.camera = this.graph.cameras[this.selectedCamera];

        // Notify interface of the update
        this.interface.setActiveCamera(this.camera);
    }

    // Trigger to be called upon update of selected camera on GUI
    updateCamera() {
        this.camera = this.graph.cameras[this.selectedCamera];

        this.interface.setActiveCamera(this.camera);
    }

    // Enable/Disable lights drawing
    toggleDisplayLights() {
        for (var i = 0; i < this.lights.length; i++)
            this.lights[i].setVisible(this.displayLights);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initLights() {
        var i = 0;
        // Lights index.

        // Reads the lights from the scene graph.
        for (var key in this.graph.lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph.lights.hasOwnProperty(key)) {
                var graphLight = this.graph.lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                
                if (graphLight[0])
                    this.lights[i].enable();

                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {
        this.displayAxis = Boolean(this.graph.referenceLength);
        this.axis = new CGFaxis(this, this.graph.referenceLength);

        this.gl.clearColor(...this.graph.background);

        this.setGlobalAmbientLight(...this.graph.ambient);

        // Init lights read from XML
        this.initLights();

        // Init cameras read from XML
        this.initCameras();

        this.interface.addInterfaceElements();

        this.setUpdatePeriod(100);
        
        this.firstFrame = Date.now();

        this.sceneInited = true;
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
        }

        if (this.sceneInited) {
            // Draw axis
            if (this.displayAxis)
                this.axis.display();

            this.defaultAppearance.apply();

            // Displays the scene (MySceneGraph function).
            this.graph.displayScene();

        }

        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress / 10.0, 0, 0, 1);

            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}