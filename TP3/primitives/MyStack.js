class MyStack extends CGFobject {
    constructor(scene, pieces) {
        super(scene);

        this.scene = scene;
        this.pieces = pieces;
    }

    display(id) {
        this.scene.registerForPick(id, this);

        this.scene.pushMatrix();

        for (let piece of this.pieces) {
            piece.display()

            this.scene.translate(0, 0.2, 0);
        }

        this.scene.popMatrix();

        this.scene.clearPickRegistration();
    }

    push(stack) {
        this.pieces.push(...stack.pieces);
    }

    clear() {
        this.pieces.splice(0, this.pieces.length); // Clear results
    }
}