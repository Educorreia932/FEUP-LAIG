class MyPrologInterface {
    constructor() {
        this.server_url = 'http://localhost:';
        this.server_port = 8081;
    }

    /**
     * Performs a HTTP request to the Prolog server, sending a JSON object
     * 
     * @param {string} request_url     Server request URL
     */
    async sendRequest(requestData) {
        const url = this.server_url + this.server_port + '/' + requestData;

        const headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');

        const response = await fetch(
            url,
            {
                method: 'GET',
                headers,
            }
        );

        return await response.text();
    }

    /**
     *  Generates a gameboard
     */
    async generateBoard(boardDimensions) {
        let rows = parseInt(boardDimensions[0]);
        let columns = parseInt(boardDimensions[4]);

        const requestData = `generate_board(${columns},${rows})`

        let response = await this.sendRequest(requestData);

        return [rows, columns, MyPrologInterface.deserializeGameBoard(response)];
    }

    /**
     *  Validates a move
     */
    async validMove(gameboard, move) {
        let player = move.player;
        let gameboardIn = JSON.stringify(MyPrologInterface.serializeGameBoard(gameboard)).replaceAll("\"", "");
        let gameboardOut = JSON.stringify(MyPrologInterface.moveStack(MyPrologInterface.serializeGameBoard(gameboard), move)).replaceAll("\"", "");

        const requestData = `valid_move(${player},${gameboardIn},${gameboardOut})`;

        let response = await this.sendRequest(requestData);

        return response == "Valid move";
    }

    /**
     *  Deserializes a gameboard
     */
    static deserializeGameBoard(response) {
        return JSON.parse(
            response
                .replaceAll("w", "\"w\"")
                .replaceAll("g", "\"g\"")
                .replaceAll("b", "\"b\"")
        );
    }

    /**
     *  Serializes a gameboard to a JSON object
     */
    static serializeGameBoard(gameboard) {
        return gameboard.state.map(function(row) {
            return row.map(stack => stack.pieces.map(piece => piece.color))
        });
    }

    static moveStack(gameboard, move) {
        let originI = move.originI;
        let originJ = move.originJ;
        let destinationI = move.destinationI;
        let destinationJ = move.destinationJ;

        let originStack = gameboard[originI][originJ];
        let destinationStack = gameboard[destinationI][destinationJ];

        destinationStack.push(...originStack);
        destinationStack.reverse();
        originStack.splice(0, originStack.length);

        return gameboard;
    }
}