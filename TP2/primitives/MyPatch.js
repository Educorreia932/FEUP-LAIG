class MyPatch extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        let surface = new CGFnurbsSurface(this.npointsU-1, this.npointsV-1, this.controlPoints);
    }

    display() {

    }
}