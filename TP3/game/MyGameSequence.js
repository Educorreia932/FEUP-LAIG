class MyGameSequence {
    constructor() {
        this.moves = [];
    }   

    addMove(move) {
        this.moves.push(move);
    }

    undo() {
        return this.moves.pop().swap();
    }

    reset() {
        this.moves = [];
    }

    reverse() {
        return this.moves.reverse();
    }
}