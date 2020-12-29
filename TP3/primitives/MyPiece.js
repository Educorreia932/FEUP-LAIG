class MyPiece extends CGFobject {
    constructor(scene, color) {
        super(scene);
        this.color = color;
    }

    display() {
        this.body.display();
    }

    setTheme(body) {
        this.body = body;
    }

    prologIdentifier() {
         return this.color.toLowerCase().charAt(0); 
    }
}