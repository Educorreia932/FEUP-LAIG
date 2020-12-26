class MyGameBoard extends CGFobject {
    constructor(scene, rows, columns) {
        super(scene);

        this.scene = scene;
        this.rows = rows;
        this.columns = columns;
        this.tiles = [];
        this.pieces = [];
        this.source = null;
        this.target = null;

        for (let i = 0; i < rows; i++) {
            let tilesRow = [];
            let piecesRow = [];

            for (let j = 0; j < columns; j++) {
                tilesRow.push(new MyTile(scene));

                let color;

                if (j < 2) 
                    color = "white";

                else if (j < 4) 
                    color = "green";

                else
                    color = "black"

                let piece = new MyPiece(scene, this.scene.graph.materials[color])

                piecesRow.push([piece]);
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

                this.scene.registerForPick(i * this.columns + j + 1, this.pieces[i][j]);
                
                this.tiles[i][j].display();  

                let piecesStack = this.pieces[i][j]

                for (let piece of piecesStack) 
                    piece.display();
                
                this.scene.popMatrix();

                this.scene.translate(1.1, 0, 0);
            }

            this.scene.popMatrix();

            this.scene.translate(0, 0, 1.1);
        }

        this.pickedPiece();
        this.scene.clearPickRegistration();
    }

    pickedPiece() {
        if (this.scene.pickMode == false) {
			if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
				for (var i = 0; i < this.scene.pickResults.length; i++) {
                    let obj = this.scene.pickResults[i][0];
                    
					if (obj) {
                        if (this.source == null)
                            this.source = this.scene.pickResults[i][1];
                        
                        else {
                            this.target = this.scene.pickResults[i][1];
                            this.movePiece();
                            this.source = null;
                            this.target = null;
                        }
					}
                }
                
				this.scene.pickResults.splice(0, this.scene.pickResults.length);
			}
		}
    }

    movePiece() {
        let j = (this.source - 1) % this.rows;
        let i = Math.floor((this.source - 1) / this.rows);

        let sourcePiece = this.pieces[i][j].pop();

        j = (this.target - 1) % this.rows;
        i = Math.floor((this.target - 1) / this.rows);

        this.pieces[i][j].push(sourcePiece);
    }
}