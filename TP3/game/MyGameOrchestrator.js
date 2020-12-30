class MyGameOrchestrator {
    constructor(scene) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator(this);
        this.prolog = new MyPrologInterface();
        this.gamemenu = new MyGameMenu(this);
        this.gameboard = new MyGameBoard(this);

        this.modes = {
            PvP: 1,
            PvE: 2,
            EvE: 3
        };

        this.states = {
            menu: "menu",
            whiteTurn: "w",
            blackTurn: "b",
        };

        this.difficulties = {
            easy: 1,
            hard: 2
        };

        this.gameState = this.states.loading;
    }

    async init() {
        this.setTheme(this.scene.graph);
        this.gameState = this.states.whiteTurn;
        this.gameDifficulty = this.difficulties.easy;
        this.gameboard.setState(await this.prolog.generateBoard(6, 6));
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        if (this.gameState == this.states.menu) 
            this.gamemenu.display();

        this.managePick(this.scene.pickMode, this.scene.pickResults);
        this.gameboard.display();
        this.animator.display();
    }

    setTheme(graph) {
        let board = graph.board;

        if (board == null) return;

        this.theme = {};

        this.theme.pieces = [];

        this.theme.pieces['w'] = graph.nodes[board.pieces[0]];
        this.theme.pieces['g'] = graph.nodes[board.pieces[1]];
        this.theme.pieces['b'] = graph.nodes[board.pieces[2]];
        console.log(graph.nodes[board.pieces[0]])

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
				for (let i = 0; i < results.length; i++) {
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
        // Picking source stack
        if (this.source == null)
            this.source = id;

            // Picking target stack
            else {
                this.target = id;

            if (this.target != this.source) {
                let move = new MyGameMove(this.source, this.target);
                this.gameboard.moveStack(this.source, this.target);
                this.changePlayerTurn();
            }

            this.source = null;
            this.target = null;
        }
    }

    changePlayerTurn() {
        this.gameState = this.gameState == "w"? "b" : "w";
    }
}