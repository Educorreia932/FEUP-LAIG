class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence(this);
        this.animator = new MyAnimator();
        this.prolog = new MyPrologInterface();
        this.gameboard = new MyGameBoard(this);

        this.prolog.generateBoard(this.gameboard);

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
        this.gameboard.display();
        // this.animator.display();
    }

    setTheme(graph) {
        let board = graph.board;

        if (board == null) return;

        this.theme = {};

        this.theme.pieces = [];

        this.theme.pieces['white'] = graph.nodes[board.pieces[0]];
        this.theme.pieces['green'] = graph.nodes[board.pieces[1]];
        this.theme.pieces['black'] = graph.nodes[board.pieces[2]];

        this.theme.tiles = [];

        for (let i = 0; i < board.tiles.length; i++) {
            if (graph.nodes[board.tiles[i]] != null) {
                this.theme.tiles.push(graph.nodes[board.tiles[i]]);
            }
        }

        this.gameboard.setTheme();
    }
}