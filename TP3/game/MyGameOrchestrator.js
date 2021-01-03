class MyGameOrchestrator {
    static dimensions = {
        small: "2 x 2",
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
        playerTurn: 1,
        moving: 2,
        waitingForAI: 3,
    };

    constructor(scene) {
        this.scene = scene;
        this.gameSequence = new MyGameSequence();
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

        this.movingPiece = null;
        this.frames = [];

        this.gameState = MyGameOrchestrator.states.menu;
    }

    reapplyTheme() {
        this.setTheme(this.scene.graph);
    }

    async newGame(boardDimensions, gamemode, difficulty) {
        this.gameState = MyGameOrchestrator.states.menu;

        this.resetPicking();
        this.movingPiece = null;
        this.frames = [];

        this.scores = {
            "w": "0",
            "b": "0"
        };

        this.ended = {
            "w": false,
            "b": false
        };

        this.nowPlaying = "b";
        
        this.startedTime = Date.now() / 1000;
        this.elapsedTime = 0;

        this.gameSequence = new MyGameSequence();
        this.animator = new MyAnimator(this);
        this.gamemode = gamemode;
        this.gameDifficulty = difficulty;
        this.initialGameboard = await this.prolog.generateBoard(boardDimensions);
        this.gameboard.setState(this.initialGameboard);
        this.setTheme(this.scene.graph);
        
        this.gameState = MyGameOrchestrator.states.playerTurn;
    }

    update(time) {
        if (this.gameState == MyGameOrchestrator.states.menu)
            return;

        this.elapsedTime = Math.floor(time - this.startedTime);

        this.scoreboard.update(time);
        this.animator.update(time);

        // Moving piece animation ended
        if (this.gameState == MyGameOrchestrator.states.moving) {
            if (this.movingPiece.animation.ended) {
                this.animator.animations.pop();

                let move = this.gameSequence.moves[this.gameSequence.moves.length - 1];
                this.gameboard.moveStack(move);
                this.movingPiece = null;
                this.gameState = MyGameOrchestrator.states.playerTurn;
                this.changePlayerTurn();
                this.updateScore();
            }
        } 

        // Movie is playing
        else if (this.frames.length != 0) {
            let move = this.frames.pop();

            this.makeMove(move);
        }
        
        else if (this.gameState == MyGameOrchestrator.states.playerTurn && !this.ended[this.gameState]) {
            if (this.gamemode == MyGameOrchestrator.modes.EvE)
                this.computerPlay();

            else if (this.gamemode == MyGameOrchestrator.modes.PvE && this.nowPlaying == "w")
                this.computerPlay();

            // Human play
            else
                this.humanPlay();
        }
    }

    async updateScore() {
        this.scores["w"] = await this.prolog.getScore("w", this.gameboard);
        this.scores["b"] = await this.prolog.getScore("b", this.gameboard);
    }

    display() {
        // Game started
        if (this.gameState != MyGameOrchestrator.states.menu) {
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
                    let validMoves = await this.prolog.getValidMoves(this.gameboard, this.nowPlaying, originCoordinates);

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
                        let move = new MyGameMove(this.nowPlaying, moveCoordinates, stackSize);

                        if (await this.prolog.validMove(this.gameboard, move))
                            this.makeMove(move);                            
                    }

                    this.gameboard.turnOffTiles();

                    this.originIndex = null;
                    this.destinationIndex = null;
                }
            }
        }
    }

    resetPicking() {
        this.gameboard.turnOffTiles();

        this.originIndex = null;
        this.destinationIndex = null;
    }

    async computerPlay() {
        this.gameState = MyGameOrchestrator.states.waitingForAI;
        let moveCoordinates = await this.prolog.getMove(this.nowPlaying, this.gameboard, this.gameDifficulty);

        if (moveCoordinates == null || this.ended[this.nowPlaying]) {
            this.ended[this.nowPlaying] = true;
            this.gameState = MyGameOrchestrator.states.playerTurn;
            this.changePlayerTurn();
        }

        else {
            let stackSize = this.gameboard.getStack(moveCoordinates[0], moveCoordinates[1]).getSize();
            let computerMove = new MyGameMove(this.nowPlaying, moveCoordinates, stackSize);

            this.makeMove(computerMove);
        }
    }

    async humanPlay() {
        // Check if player has any valid moves
        // If AI cannot make a move, neither can the player
        let validMoves = await this.prolog.getMove(this.nowPlaying, this.gameboard, this.gameDifficulty);

        if (validMoves == null) {
            this.ended[this.nowPlaying] = true;
            this.changePlayerTurn();
        }

        else
            this.managePick(this.scene.pickMode, this.scene.pickResults);
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
        this.nowPlaying = this.nowPlaying == "w" ? "b" : "w";
    }

    undo() {
        if (this.gameState == MyGameOrchestrator.states.playerTurn && !this.gameEnded()) {
            if (this.gamemode == MyGameOrchestrator.modes.PvP)
                this.undoMove();
    
            // May only undo move on human player turn
            else if (this.gamemode == MyGameOrchestrator.modes.PvE && this.nowPlaying == "b") {
                this.undoMove();
                
                // Undo computer move
                if (this.gameSequence.moves.length > 1) 
                    this.undoMove(); 
            }

            this.updateScore();
        }
    }

    /**
     *  Undo the last move
     */
    undoMove() {
        let lastMove = this.gameSequence.undo();
        this.gameboard.moveStack(lastMove);
        this.changePlayerTurn();
    }

    /**
     *  Play movie
     */
    playMovie() {
        if (this.gameEnded() && this.frames.length == 0 && this.gameState != MyGameOrchestrator.states.moving) {
            this.gameboard.setState(this.initialGameboard);
            this.reapplyTheme();
            
            this.frames = this.gameSequence.reverse();
            this.gameSequence = new MyGameSequence();
        }
    }

    gameEnded() {
        return this.ended["w"] && this.ended["b"];
    }
}