class MyTile extends CGFobject {
    constructor(scene) {
        super(scene);

        this.body = new MyRectangle(scene, 0, 0, 1, 1);
    }

    initBuffers() {
        
    }

    display() {
        this.object.display();
    }
}