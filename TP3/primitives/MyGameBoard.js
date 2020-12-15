class MyGameBoard extends CGFobject {
    constructor(scene, rows, columns) {
        super(scene);

        this.scene = scene;
        this.tiles = []

        for (let i = 0; i < rows; i++) {
            let row = [];

            for (let j = 0; j < columns; j++)
                row.push(new MyTile(scene));
        }
    }

    display() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                tiles[i][j].display();  
                this.scene.translate(1, 0, 0);
            }

            this.scene.translate(-rows, 0, 0);
            this.scene.translate(0, 0, 1);
        }
    }
}