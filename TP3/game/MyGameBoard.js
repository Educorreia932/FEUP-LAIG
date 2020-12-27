class MyGameBoard extends CGFobject {
    constructor(scene) {
        super(scene);

        this.scene = scene;
        this.rows = 6;
        this.columns = 6;
        this.tiles = [];
        this.state = null;

        for (let i = 0; i < this.rows; i++) {
            let tilesRow = [];

            for (let j = 0; j < this.columns; j++) 
                tilesRow.push(new MyTile(scene));

            this.tiles.push(tilesRow);
        }
    }

    display() {
        this.scene.translate(0, 0, 1);

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
    }

    moveStack(source, target) {
        let sourceJ = (source - 1) % this.rows;
        let sourceI = Math.floor((source - 1) / this.rows);

        let sourceStack = this.state[sourceI][sourceJ];

        let targetJ = (target - 1) % this.rows;
        let targetI = Math.floor((target - 1) / this.rows);

        let targetStack = this.state[targetI][targetJ];

        targetStack.push(sourceStack);
        sourceStack.clear();
    }

    setState(gameboard) {
        this.state = gameboard.map(function(row) {
            return row.map(collumn => new MyStack(this.scene, [new MyPiece(this.scene, collumn[0])]))
        }.bind(this));
    }
}