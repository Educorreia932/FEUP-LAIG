class MyTile extends CGFobject {
    constructor(scene) {
        super(scene);

        this.body = new MyRectangle(scene, 0, 0, 1, 1);
    }

    initBuffers() {
        
    }

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Place tile on XZ plane

        this.body.display();

        this.scene.popMatrix();
    }
}