class MyGameOrchestrator {
    static dimensions = {
        small: "6 x 6",
        medium: "6 x 9",
        large: "9 x 9"
    };

    static modes = {
        PvP: "Player VS Player",
        PvE: "Player VS AI",
        EvE: "AI VS AI"
    };

    static difficulties = {
        random: "Random",
        smart: "Smart"
    };

    static states = {
        menu: 0,
        whiteTurn: 1,
        blackTurn: 2,
    };

    constructor(scene) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator(this);
        this.prolog = new MyPrologInterface();
        this.gameboard = new MyGameBoard(this);

        this.gameState = MyGameOrchestrator.states.menu;
    }

    async newGame(boardDimensions, gamemode, difficulty) {
        this.gamemode = gamemode;
        this.gameDifficulty = difficulty;
        this.gameboard.setState(await this.prolog.generateBoard(boardDimensions));
        this.setTheme(this.scene.graph);
        this.gameState = MyGameOrchestrator.states.blackTurn;
    }

    update(time) {
        this.animator.update(time);
    }

    display() {
        if (this.gameState == MyGameOrchestrator.states.menu) 
            ;

        // Game started
        else {
            this.managePick(this.scene.pickMode, this.scene.pickResults);
            this.gameboard.display();
            this.animator.display();
        }
    }

    setTheme(graph) {
        let board = graph.board;

        if (board == null) return;

        this.theme = {};

        this.theme.pieces = [];

        this.theme.pieces['w'] = graph.nodes[board.pieces[0]];
        this.theme.pieces['g'] = graph.nodes[board.pieces[1]];
        this.theme.pieces['b'] = graph.nodes[board.pieces[2]];

        this.theme.tiles = [];

        for (let i = 0; i < board.tiles.length; i++)
            if (graph.nodes[board.tiles[i]] != null)
                this.theme.tiles.push(graph.nodes[board.tiles[i]]);

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
        if (object instanceof MyStack) {
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
    }

    changePlayerTurn() {
        let whiteTurn = MyGameOrchestrator.states.blackTurn;
        let blackTurn = MyGameOrchestrator.states.blackTurn;

        this.gameState = (this.gameState == whiteTurn) ? blackTurn : whiteTurn;
    }
}