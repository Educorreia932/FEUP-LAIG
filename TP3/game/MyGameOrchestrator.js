class MyGameOrchestrator {
    static dimensions = {
        small: "3 x 3",
        medium: "6 x 6",
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
        whiteTurn: "w",
        blackTurn: "b",
    };

    constructor(scene) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence(scene);
        this.animator = new MyAnimator(this);
        this.prolog = new MyPrologInterface();
        this.gameboard = new MyGameBoard(this);
        this.scoreboard = new MyGameScoreBoard(this);

        this.scores = {
            "w": "0",
            "b": "0"
        };

        this.ended = {
            "w": false,
            "b": false
        };

        this.gameState = MyGameOrchestrator.states.menu;
    }

    reapplyTheme() {
        this.setTheme(this.scene.graph);
    }

    async newGame(boardDimensions, gamemode, difficulty) {
        this.gamemode = gamemode;
        this.gameDifficulty = difficulty;
        this.gameboard.setState(await this.prolog.generateBoard(boardDimensions));
        this.setTheme(this.scene.graph);
        this.gameState = MyGameOrchestrator.states.blackTurn;
    }

    update(time) {
        this.scoreboard.update(time);
        this.animator.update(time);

        if (!this.ended[this.gameState]) {
            if (this.gamemode == MyGameOrchestrator.modes.EvE)
                this.computerPlay();

            else 
                this.managePick(this.scene.pickMode, this.scene.pickResults);
        }
    }

    display() {
        if (this.gameState == MyGameOrchestrator.states.menu) 
            ;

        // Game started
        else {
            this.scoreboard.display();
            this.gameboard.display();
            this.animator.display();
        }
    }

    setTheme(graph) {
        let board = graph.board;

        if (board == null) 
            return;

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

    async onObjectSelected(object, id) {
        if (object instanceof MyStack) {
            // Picking origin stack
            if (this.originIndex == null) {
                this.originIndex = id;

                let originCoordinates = this.gameboard.convertIndex(this.originIndex);
                let validMoves = await this.prolog.getValidMoves(this.gameboard, this.gameState, originCoordinates);

                this.gameboard.hightlightTiles(validMoves);
            }

            // Picking destination stack
            else {
                this.destinationIndex = id;

                if (this.destinationIndex != this.originIndex) {    
                    let originCoordinates = this.gameboard.convertIndex(this.originIndex);
                    let destinationCoordinates = this.gameboard.convertIndex(this.destinationIndex);
                    let moveCoordinates = originCoordinates.concat(destinationCoordinates);
                    let stackSize = this.gameboard.getStack(moveCoordinates[0], moveCoordinates[1]).getSize();
                    let move = new MyGameMove(this.gameState, moveCoordinates, stackSize);

                    if (await this.prolog.validMove(this.gameboard, move)) {
                        this.makeMove(move);
                        this.changePlayerTurn();

                        if (this.gamemode == MyGameOrchestrator.modes.PvE)
                            this.computerPlay();
                    }
                }

                this.gameboard.turnOffTiles();

                this.originIndex = null;
                this.destinationIndex = null;
            }
        }
    }

    async computerPlay() {
        let moveCoordinates = await this.prolog.getMove(this.gameState, this.gameboard, this.gameDifficulty);

        if (moveCoordinates == null)
            this.ended[this.gameState] = true;
    
        else {
            let stackSize = this.gameboard.getStack(moveCoordinates[0], moveCoordinates[1]).getSize();
            let computerMove = new MyGameMove(this.gameState, moveCoordinates, stackSize);

            this.makeMove(computerMove);
        }

        this.changePlayerTurn();
    }

    async makeMove(move) {
        this.animator.addMoveAnimation(move);
        this.gameSequence.addMove(move);
        this.gameboard.moveStack(move);
        this.scores[this.gameState] = await this.prolog.getScore(this.gameState, this.gameboard);
    }

    /**
     *  Change player turn to next player
     */
    changePlayerTurn() {
        let whiteTurn = MyGameOrchestrator.states.whiteTurn;
        let blackTurn = MyGameOrchestrator.states.blackTurn;

        this.gameState = (this.gameState == whiteTurn) ? blackTurn : whiteTurn;
    }

    /**
     *  Undo the last move
     */
    undo() {
        let lastMove = this.gameSequence.removeLastMove();
        this.gameboard.moveStack(lastMove);
    }

    /**
     *  Play movie
     */
    playMovie() {
        console.log("Not implemented yet");
    }
}