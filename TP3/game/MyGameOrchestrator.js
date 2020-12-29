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
            whiteTurn: "w",
            blackTurn: "b",
        };

        this.difficulties = {
            easy: 1,
            hard: 2
        };
    }

    async init() {
        this.gameState = this.states.whiteTurn;
        this.gameDifficulty = this.difficulties.easy;
        this.gameboard.setState(await this.prolog.generateBoard(6, 6));
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        this.managePick(this.scene.pickMode, this.scene.pickResults);
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

    managePick(mode, results) {
        if (mode == false) {
			if (results != null && results.length > 0) {
				for (var i = 0; i < results.length; i++) {
                    let object = results[i][0];
                    let id = results[i][1];
                    
                    if (object) 
                        this.onObjectSelected(object, id);
                }
                
				results.splice(0, results.length); // Clear results
			}
		}
    }

    onObjectSelected(object, id) {
        MyPrologInterface.serializeGameBoard(this.gameboard.state);

        // Picking source stack
        if (this.source == null)
            this.source = id;

            // Picking target stack
            else {
                this.target = id;

            if (this.target != this.source) 
                this.gameboard.moveStack(this.source, this.target)

            this.source = null;
            this.target = null;
        }
    }
}