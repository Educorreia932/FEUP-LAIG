class MyPiece extends CGFobject {
    constructor(scene, color) {
        super(scene);
        this.color = color;
        this.material = this.scene.graph.materials[this.color];
    }

    display() {
        this.body.display();
    }

    setTheme(body) {
        this.body = body;
    }
}