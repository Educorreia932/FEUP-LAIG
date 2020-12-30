class MyPiece extends CGFobject {
    constructor(orchestractor, color) {
        super(orchestractor.scene);

        this.orchestractor = orchestractor;
        this.color = color;

        this.setTheme(this.orchestractor.theme.pieces[this.color]);
    }

    display() {
        this.body.display();
    }

    setTheme(body) {
        this.body = body;
        console.log(this.body)
    }
}