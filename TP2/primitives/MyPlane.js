class MyPlane extends CGFobject {
    constructor(scene, npartsU, npartsV) {
        super(scene);

        this.narptsU = npartsU;
        this.npartsV = npartsV;

        this.initBuffers();
    }

    initBuffers() {
        let controlPoints = [
            [[-0.5, 0.0, 0.5, 1],
             [-0.5, 0.0, -0.5, 1]],
            [[0.5, 0.0, 0.5, 1],
             [0.5, 0.0, -0.5, 1]]
        ];


        let surface = new CGFnurbsSurface(1, 1, controlPoints);
        this.object = new CGFnurbsObject(this.scene, this.npartsU, this.npartsV, surface);
    }

    display() {
        this.object.display();
    }
}