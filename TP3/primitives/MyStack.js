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

    push(stack, stackSize) {
        stack.pieces = stack.pieces.reverse();

        for (let i = stackSize - 1; i >= 0; i--)
            this.pieces.push(stack.pieces[i]);
    }

    remove(stackSize) {
        this.pieces = this.pieces.reverse();

        for (let i = stackSize - 1; i >= 0; i--)
            this.pieces.pop();
    }

    getSize() {
        return this.pieces.length;
    }
}