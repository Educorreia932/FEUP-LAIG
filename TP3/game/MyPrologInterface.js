class MyPrologInterface {
    constructor() {
        this.server_url = 'http://localhost:';
        this.server_port = 8081;
    }

    /**
     * Performs a HTTP request to the Prolog server, sending a JSON object
     * 
     * @param {string} request_url     Server request URL
     * @param {string} request_data    Request body 
     * @param {Function} onLoad        Function to call on success
     * @param {Function} onError       Function to call on error
     */
    send_request(request_data, onLoad, onError) {
        let request = new XMLHttpRequest();
        request.open('GET', this.server_url + this.server_port + '/' + request_data, true);

        request.onload = onLoad || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    generateBoard(gameBoard) {
        let columns = 6;
        let rows = 6;
        let requestData = `generate_board(${columns},${rows})`;

        let response;

        this.send_request(requestData, function(data) {
            response = data.target.response
                .replaceAll("w", "\"w\"")
                .replaceAll("g", "\"g\"")
                .replaceAll("b", "\"b\"");

            let responseArray = JSON.parse(response);

            gameBoard.setState(responseArray)
        });
    }
}