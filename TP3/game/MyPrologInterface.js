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
        let gameboardIn = MyPrologInterface.serializeGameBoard(gameboard);

        let coordinates = JSON.stringify([
            move.originI, 
            move.originJ,
            move.destinationI,
            move.destinationJ
        ]);

        const requestData = `valid_move(${player},${gameboardIn},${coordinates})`;

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
        return JSON.stringify(gameboard.state.map(function(row) {
            return row.map(stack => stack.pieces.map(piece => piece.color).reverse())
        })).replaceAll("\"", "");
    }
}