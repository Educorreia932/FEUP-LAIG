class MyPiece extends CGFobject {
    constructor(scene, color) {
        super(scene);

        this.scene = scene;
        this.body = new MyCylinder(this.scene, 0.4, 0.4, 0.2, 20, 10);
        this.color = color;
        this.material = this.scene.graph.materials[this.color];
    }

    display() {
        this.scene.pushMaterial(this.material);
        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Place piece on XZ plane
        this.scene.translate(0.5, 0.5, 0);

        this.body.display();

        this.scene.popMatrix();
        this.scene.popMaterial();
    }
}