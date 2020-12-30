class MyGameSequence {
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
        this.moves = [];
    }   

    addMove(move) {
        this.moves.push(move);
    }

    reset() {

    }

    undo() {

    }
}