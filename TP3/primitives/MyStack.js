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
        let gameboard = this.scene.gameOrchestrator.gameboard;

        let destHeight = gameboard.getStack(move.destinationI, move.destinationJ).pieces.length;

        let dy = (move.destinationI - move.originI);
        let dx = (move.destinationJ - move.originJ);

        let height = this.scene.gameOrchestrator.theme.piecesHeight;
        let percent = this.scene.gameOrchestrator.theme.heightOffsetPercent;

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
            translation: [0, (destHeight + 0.5) * height, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframe_2 = {
            instant: instant + 2,
            translation: [dx, (destHeight + 0.5) * height, dy],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframe_3 = {
            instant: instant + 3,
            translation: [dx, (destHeight - percent) * height, dy],
            rotation: [0, 0, 0],
            scale: [1, 1, 1]
        }

        let keyframes = [
            keyframe_0,
            keyframe_1,
            keyframe_2,
            keyframe_3
        ];

        let interpolations = [this.linearInterpolation.bind(this), this.arcInterpolation.bind(this), this.linearInterpolation.bind(this)];

        this.animation = new MyKeyframeAnimation(this.scene, keyframes, interpolations);
        this.scene.gameOrchestrator.animator.animations.push(this.animation);
    }

    linearInterpolation(t, startTransformation, endTransformation) {
        let result = vec3.create();

        return vec3.lerp(result, startTransformation, endTransformation, t);
    }

    arcInterpolation(time, startTransformation, endTransformation) {
        let mid_point = vec3.create();
        mid_point = vec3.lerp(mid_point, startTransformation, endTransformation, 0.5);
        let radius = vec3.distance(startTransformation, mid_point);

        let axis_z = vec3.fromValues(0, 1, 0);

        let centeredStart = vec3.create();
        let centeredEnd = vec3.create();

        centeredStart = vec3.sub(centeredStart ,startTransformation, mid_point);
        centeredEnd = vec3.sub(centeredEnd, endTransformation, mid_point);

        let has_x = centeredStart[0] != 0;
        let has_y = centeredStart[2] != 0;

        let dotStart = vec3.dot(centeredStart, axis_z);
        let dotEnd = vec3.dot(centeredEnd, axis_z);
        let normStart = vec3.length(centeredStart);
        let normEnd = vec3.length(centeredEnd);

        let angle_start =  Math.acos(dotStart / normStart) * this.orientation(centeredStart) + Math.PI / 2;
        let angle_end =  Math.acos(dotEnd / normEnd)* this.orientation(centeredEnd) + Math.PI / 2;

        let alpha = angle_start + time * (angle_end - angle_start);

        let offset = vec3.fromValues(Math.cos(alpha) * radius * has_x, Math.sin(alpha) * radius, Math.cos(alpha) * radius * has_y);
        let result = vec3.create();
        return vec3.add(result, mid_point, offset); 
    }

    orientation(vector) {
        if (vector[0] == 0 && vector[2] == 0) return 0;
        if (vector[0] > 0 || vector[2] > 0) return -1;
        if (vector[0] < 0 || vector[2] < 0) return 1;
    }
}