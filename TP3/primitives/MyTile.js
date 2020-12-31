class MyTile extends CGFobject {
    constructor(gameboard) {
        super(gameboard.scene);
        this.gameboard = gameboard;
        this.scene = gameboard.scene;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Place tile on XZ plane

        this.body.display();
        
        this.scene.popMatrix();
    }

    setTheme(body) {
        this.body = body;
    }
}