class MyPatch extends CGFobject {
    constructor(scene, npointsU, npointsV, npartsU, npartsV, controlPoints) {
        super(scene);
        
        this.scene = scene;
        this.npointsU = npointsU;
        this.npointsV = npointsV;
        this.npartsU = npartsU;
        this.npartsV = npartsV;
        this.controlPoints = controlPoints;

        this.initBuffers();
    }

    initBuffers() {
        let degree1 = this.npointsU - 1;
        let degree2 =  this.npointsV - 1;

        let surface = new CGFnurbsSurface(degree1, degree2, this.controlPoints);
        this.object = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, surface);
    }

    display() {
        this.object.display();
    }
}