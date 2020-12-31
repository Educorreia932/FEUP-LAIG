class MyGameMove {
    constructor(player, originCoordinates, destinationCoordinates) {
        this.player = player;

        this.originI = originCoordinates[0];
        this.originJ = originCoordinates[1];
        this.destinationI = destinationCoordinates[0];
        this.destinationJ = destinationCoordinates[1];

        // this.stackSize = stackSize;
    }

    /**
     *  Swap origin and destination coordinates
     *  Effectively undoing the move
     */
    swap() {
        [this.originI, this.destinationI] = [this.destinationI, this.originI];
        [this.originJ, this.destinationJ] = [this.destinationJ, this.originJ];
    }
}