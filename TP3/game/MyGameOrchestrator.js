class MyGameOrchestrator {

    constructor(scene) {
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator();
        // this.gameboard = new MyGameboard();
        // this.theme = new MySceneGraph();
        // this.prolog = new MyPrologInterface();

        this.modes = {
            PvP: 1,
            PvE: 2,
            EvE: 3
        };

        this.states = {
            menu: 0,
            playerTurn: 1,
            botTurn: 2,
    
        };

        this.difficulties = {
            easy: 1,
            hard: 2
        };
    }

    init() {
        this.gameState = this.states.menu;
        this.gameDifficulty = this.difficulties.easy;
        
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