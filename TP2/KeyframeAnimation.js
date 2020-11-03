class KeyframeAnimation extends Animation {
    constructor(scene, keyframes) {
        super();
        this.scene = scene;
        this.keyframes = keyframes;

        this.actualKF = 0;
        this.nextKF = 1;
    }

    update(time) {
        if (this.actualKF == this.keyframes.length)
            return;

        this.Ma = mat4.create();

        let translationValues = linearInterpolation(time, "translation");
        let rotationValues = linearInterpolation(time, "rotation");
        let scaleValues = linearInterpolation(time, "scale");

        this.Ma.translate(this.Ma, this.Ma, translationValues);

        this.resultMatrix = mat4.rotate(this.Ma, this.Ma, rotationValues[0] * DEGREE_TO_RAD, [1 ,0, 0]);
        this.resultMatrix = mat4.rotate(this.Ma, this.Ma, rotationValues[1] * DEGREE_TO_RAD, [0, 1, 0]);
        this.resultMatrix = mat4.rotate(this.Ma, this.Ma, rotationValues[2] * DEGREE_TO_RAD, [0, 0, 1]);

        this.resultMatrix = mat4.scale(this.resultMatrix, this.resultMatrix, scaleValues);

        if (time >= this.keyframes[this.nextKF]["instant"]) {
            this.actualKF++;
            this.nextKF++;
        }
    }

    apply() {
        this.scene.multMatrix(this.Ma);
    }

    linearInterpolation(time, transformationType) {
        let startTransformation = this.keyframes[this.actualKF][transformationType];
        let startTime = this.keyframes[this.actualKF]["instant"];
        let endTransformation = this.keyframes[this.nextKF][transformationType];
        let endTime = this.keyframes[this.nextKF]['instant'];

        let result = vec3.create();

        t = (time - startTime) / (endTime - startTime);

        return lerp(result, startTransformation, endTransformation, t);
    }
}
