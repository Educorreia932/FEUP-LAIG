class MyPiece extends CGFobject {
    constructor(scene, material) {
        super(scene);

        this.body = new MyCylinder(this.scene, 0.4, 0.4, 0.2, 20, 10);
        this.material = material;
    }

    display() {
        this.scene.pushMaterial(this.material);
        this.scene.pushMatrix();

        this.scene.translate(0.5, 0.5, 0);

        this.body.display();

        this.scene.popMatrix();
        this.scene.popMaterial();
    }
}