class MyTile extends CGFobject {
    constructor(gameboard) {
        super(gameboard.scene);
        this.gameboard = gameboard;
        this.scene = gameboard.scene;
    }

    initBuffers() {
        
    }

    display() {
        this.body.display();
    }

    setTheme(body) {
        this.body = body;
    }
}