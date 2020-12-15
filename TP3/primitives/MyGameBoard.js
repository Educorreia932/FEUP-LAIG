class MyGameBoard extends CGFobject {
    constructor(scene, rows, columns) {
        super(scene);

        this.scene = scene;
        this.rows = rows;
        this.columns = columns;
        this.tiles = [];
        this.pieces = [];

        for (let i = 0; i < rows; i++) {
            let tilesRow = [];
            let piecesRow = [];

            for (let j = 0; j < columns; j++) {
                tilesRow.push(new MyTile(scene));
                piecesRow.push(new MyPiece(scene));
            }

            this.tiles.push(tilesRow);
            this.pieces.push(piecesRow);
        }
    }

    display() {
        this.scene.translate(0, 0, 1);

        for (let i = 0; i < this.rows; i++) {
            this.scene.pushMatrix();

            for (let j = 0; j < this.columns; j++) {
                this.scene.pushMatrix();
                
                this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Place tiles on XZ plane

                this.tiles[i][j].display();  
                this.pieces[i][j].display();
                
                this.scene.popMatrix();

                this.scene.translate(1.1, 0, 0);
            }

            this.scene.popMatrix();

            this.scene.translate(0, 0, 1.1);
        }
    }
}