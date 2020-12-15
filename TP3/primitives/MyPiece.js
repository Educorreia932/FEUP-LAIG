class MyPiece extends CGFobject {
    constructor(scene, color) {
        this.body = new MyCylinder(this.scene, 1, 1, 1, 20, 10);
    }

    display() {
        this.object.display();
    }
}