class MyAnimator {
    constructor(orchestractor) {
        this.orchestractor = orchestractor;
        this.scene = this.orchestractor.scene;
        this.gameboard = this.orchestractor.gameboard;
        this.animations = [];
    }

    start() {
        
    }

    reset() {

    }

    update(time) {
        for (let animation of this.animations)
            animation.update(time);
    }
}