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
        moving: 1,
        waitingForAI: 2,
        whiteTurn: "w",
        blackTurn: "b"
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

        this.movingPiece = null;
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
        this.lastPlayer = MyGameOrchestrator.states.whiteTurn;
    }

    update(time) {
        this.scoreboard.update(time);
        this.animator.update(time);

        if (this.movingPiece != null) {
            if (this.movingPiece.animation.ended) {
                this.animator.animations.pop();
                let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
                this.gameboard.moveStack(move);
                this.movingPiece = null;
                this.changePlayerTurn();
                this.updateScore();
            }
        } else if (this.isPlayerTurn() && !this.ended[this.gameState]) {
            if (this.gamemode == MyGameOrchestrator.modes.EvE)
                this.computerPlay();

            else 
                this.managePick(this.scene.pickMode, this.scene.pickResults);
        }
    }

    isPlayerTurn() {
        return this.gameState == MyGameOrchestrator.states.blackTurn ||
                this.gameState == MyGameOrchestrator.states.whiteTurn; 
    }

    async updateScore() {
        this.scores[this.gameState] = await this.prolog.getScore(this.gameState, this.gameboard);
    }

    display() {
        if (this.gameState == MyGameOrchestrator.states.menu) 
            ;

        // Game started
        else {
            this.scoreboard.display();
            this.gameboard.display();
        }
    }

    setTheme(graph) {
        let board = graph.board;

        if (board == null) 
            return;

        this.theme = {};

        this.theme.piecesHeight = board.piecesHeight;
        this.theme.heightOffsetPercent = board.heightOffsetPercent;

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
            if (this.gameState != MyGameOrchestrator.states.moving) {
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
    }

    async computerPlay() {
        let turn = this.gameState;
        this.gameState = MyGameOrchestrator.states.waitingForAI;
        let moveCoordinates = await this.prolog.getMove(turn, this.gameboard, this.gameDifficulty);

        if (moveCoordinates == null)
            this.ended[this.gameState] = true;
    
        else {
            let stackSize = this.gameboard.getStack(moveCoordinates[0], moveCoordinates[1]).getSize();
            let computerMove = new MyGameMove(this.gameState, moveCoordinates, stackSize);

            this.makeMove(computerMove);
        }
    }

    makeMove(move) {
        this.gameSequence.addMove(move);
        this.movingPiece = this.gameboard.setMovingPiece(move);
        this.gameState = MyGameOrchestrator.states.moving;
    }

    /**
     *  Change player turn to next player
     */
    changePlayerTurn() {
        this.gameState = this.lastPlayer;

        this.lastPlayer = (this.gameState == MyGameOrchestrator.states.whiteTurn) ? MyGameOrchestrator.states.blackTurn : MyGameOrchestrator.states.whiteTurn;
    }

    undo() {
        if (this.isPlayerTurn()) {
            if (this.gamemode == MyGameOrchestrator.modes.PvP) {
                this.undoMove();
            }
    
            else if (this.gamemode == MyGameOrchestrator.modes.PvE && this.gameState == MyGameOrchestrator.states.blackTurn) {
                this.undoMove();
                this.undoMove();
            }

            this.updateScore();
        }
    }

    /**
     *  Undo the last move
     */
    undoMove() {
        let lastMove = this.gameSequence.removeLastMove();
        this.gameboard.moveStack(lastMove);
        this.changePlayerTurn();
    }

    /**
     *  Play movie
     */
    playMovie() {
        console.log("Not implemented yet");
    }
}