class MyGameMove {
    constructor(player, originCoordinates, destinationCoordinates) {
        this.player = player;

        this.originI = originCoordinates[0];
        this.originJ = originCoordinates[1];
        this.destinationI = destinationCoordinates[0];
        this.destinationJ = destinationCoordinates[1];
    }
}