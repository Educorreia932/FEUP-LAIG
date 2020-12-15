class MyPiece extends CGFobject {
    constructor(scene, color) {
        super(scene);
        this.body = new MyCylinder(this.scene, 0.5, 0.5, 1, 20, 10);
    }

    display() {
        this.body.display();
    }
}