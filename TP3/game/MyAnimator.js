class MyAnimator {
    constructor(orchestractor) {
        this.orchestractor = orchestractor;
        this.scene = this.orchestractor.scene;
        this.animations = [];
    }

    start() {
        
    }

    reset() {

    }

    update(time) {
        for (let animation of this.animations) {
            animation.update(time);
        }
    }

    display() {
        for (let animation of this.animations) {
            this.scene.pushMatrix();

            animation.update(time);

            this.scene.popMatrix();
        }
    }

    addMoveAnimation(move) {
        this.animations.push();

        move.originCoordinates
        move.destinationCoordinates

        let keyframes = [
            
        ];
    }
}