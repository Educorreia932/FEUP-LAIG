class MyGameOrchestrator {
    constructor() {
        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator();
        this.gameboard = new MyGameboard();
        this.theme = new MySceneGraph();
        this.prolog = new MyPrologInterface();
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        this.theme.display();
        this.gameboard.display();
        this.animator.display();
    }
}