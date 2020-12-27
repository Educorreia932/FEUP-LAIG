class MyPiece extends CGFobject {
    constructor(scene, color) {
        super(scene);

        this.body = new MyCylinder(this.scene, 0.4, 0.4, 0.2, 20, 10);
        this.material = this.scene.graph.materials[color];
        this.color = color;
    }

    display() {
        this.scene.pushMaterial(this.material);
        this.scene.pushMatrix();

        this.scene.translate(0.5, 0.5, 0);

        this.body.display();

        this.scene.popMatrix();
        this.scene.popMaterial();
    }

    prologIdentifier() {
         return this.color.toLowerCase().charAt(0); 
    }
}