class MyGameBoard extends CGFobject {
    constructor(orchestrator) {
        super(orchestrator.scene);

        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(-this.rows/2 * 1.1 + 1.1/2, this.columns/2 * 1.1 - 1.1/2, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);

        for (let i = 0; i < this.rows; i++) {
            this.scene.pushMatrix();

            for (let j = 0; j < this.columns; j++) {
                this.tiles[i][j].display();  

                this.scene.pushMatrix();

                if (this.state != null) {
                    let stack = this.state[i][j]
                    stack.display(i * this.columns + j + 1, this.state[i][j])
                }

                this.scene.popMatrix();

                this.scene.translate(1.1, 0, 0);
            }

            this.scene.popMatrix();

            this.scene.translate(0, 0, 1.1);
        }

        this.scene.popMatrix();
    }

    moveStack(move) {
        let originI = move.originI;
        let originJ = move.originJ;
        let destinationI = move.destinationI;
        let destinationJ = move.destinationJ;

        let originStack = this.state[originI][originJ];
        let destinationStack = this.state[destinationI][destinationJ];

        destinationStack.push(originStack);
        originStack.clear();
    }

    setState(gameboard) {
        this.tiles = [];
        this.rows = gameboard[0];
        this.columns = gameboard[1];

        for (let i = 0; i < this.rows; i++) {
            let tilesRow = [];

            for (let j = 0; j < this.columns; j++)
                tilesRow.push(new MyTile(this));

            this.tiles.push(tilesRow);
        }

        this.state = gameboard[2].map(function(row) {
            return row.map(collumn => new MyStack(this.scene, [new MyPiece(this.orchestrator, collumn[0])]))
        }.bind(this));
    }

    setTheme() {
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.columns; j++) 
                this.tiles[i][j].setTheme(this.orchestrator.theme.tiles[(i + j) % 2]);

        for (let i = 0; i < this.rows && i < this.state.length; i++) {
            for (let j = 0; j < this.columns && j < this.state[i].length; j++) {
                let piecesStack = this.state[i][j].pieces;

                for (let k = 0; k < piecesStack.length; k++)
                    piecesStack[k].setTheme(this.orchestrator.theme.pieces[piecesStack[k].color]);
            }
        }
    }

    convertIndex(index) {
        let i = Math.floor((index - 1) / this.rows);
        let j = (index - 1) % this.columns;

        return [i, j];
    }
}