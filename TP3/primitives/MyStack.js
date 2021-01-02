class MyStack extends CGFobject {
    constructor(scene, pieces) {
        super(scene);

        this.scene = scene;
        this.pieces = pieces;
        this.animation = null;
    }

    display(id) {
        this.scene.registerForPick(id, this);

        this.scene.pushMatrix();

        if (this.animation != null)
            this.animation.apply();

        for (let piece of this.pieces) {
            piece.display()

            this.scene.translate(0, 0.2, 0);
        }

        this.scene.popMatrix();

        this.scene.clearPickRegistration();
    }

    push(stack, stackSize) {
        stack.pieces = stack.pieces.reverse();

        for (let i = stackSize - 1; i >= 0; i--)
            this.pieces.push(stack.pieces[i]);
    }

    remove(stackSize) {
        this.pieces = this.pieces.reverse();

        for (let i = stackSize - 1; i >= 0; i--)
            this.pieces.pop();
    }

    getSize() {
        return this.pieces.length;
    }

    setAnimation(move, instant) {
        console.log('Instant ' + instant);
        let gameboard = this.scene.gameOrchestrator.gameboard;

        let destHeight = gameboard.getStack(move.destinationI, move.destinationJ).pieces.length;

        let dy = (move.destinationI - move.originI);
        let dx = (move.destinationJ - move.originJ);

        dy += 0.1 * dy;
        dx += 0.1 * dx;

        // keyframe
        let keyframe_0 = {
            instant: instant,
            translation: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframe_1 = {
            instant: instant + 1,
            translation: [0, (destHeight + 0.5) * 0.2, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframe_2 = {
            instant: instant + 2,
            translation: [dx, (destHeight + 0.5) * 0.2, dy],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframe_3 = {
            instant: instant + 3,
            translation: [dx, (destHeight) * 0.2, dy],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframes = [
            keyframe_0,
            keyframe_1,
            keyframe_2,
            keyframe_3
        ];

        this.animation = new MyKeyframeAnimation(this.scene, keyframes);
        this.scene.gameOrchestrator.animator.animations.push(this.animation);
    }

    linearInterpolation(t, startTransformation, endTransformation) {
        let result = vec3.create();

        return vec3.lerp(result, startTransformation, endTransformation, t);
    }

    arcInterpolation(time, startTransformation, endTransformation) {
        
    }
}