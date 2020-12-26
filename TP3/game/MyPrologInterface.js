class MyPrologInterface {
    constructor() {
        const server_url = 'http://localhost:';
        const server_port = 8001;
    }

    /**
     * Performs a HTTP request to the Prolog server, sending a JSON object
     * 
     * @param {string} request_url  Server request URL
     * @param {string} request_data    Request body 
     * @param {Function} onLoad     Function to call on success
     * @param {Function} onError    Function to call on error
     */
    send_request(request_data, onLoad, onError) {
        let request = new XMLHttpRequest();
        request.open('GET', this.server_url + this.server_port + '/' + request_data, true);

        request.onload = onLoad || function(data){console.log("Request successful. Reply: " + data.target.response);};
        request.onerror = onError || function(){console.log("Error waiting for response");};

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }
}