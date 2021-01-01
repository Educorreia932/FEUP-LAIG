class MyGameSequence {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.moves = [];
    }   

    addMove(move) {
        this.moves.push(move);
    }

    removeLastMove() {
        return this.moves.pop().swap();
    }

    reset() {

    }

    undo() {

    }
}