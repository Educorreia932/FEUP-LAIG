class KeyframeAnimation extends Animation {
    constructor(scene, keyframes) {
        super();
        this.scene = scene;
        this.keyframes = keyframes;

        this.actualKF = 0;
        this.nextKF = 1;
    }

    update(time) {
        // Animation ended
        if (this.actualKF == this.keyframes.length)
            return;

        // Create animation matrix
        this.Ma = mat4.create();

        if (time >= this.keyframes[this.nextKF]["instant"]) {
            this.actualKF++;
            this.nextKF++;

            // Save start and end transformations and instants for current segment
            this.startInstant = this.keyframes[this.actualKF]["instant"];
            this.endInstant = this.keyframes[this.nextKF]['instant'];

            this.startTranslation = this.keyframes[this.actualKF]["translation"];
            this.endTranslation = this.keyframes[this.nextKF]["translation"];

            this.startRotation = this.keyframes[this.actualKF]["rotation"];
            this.endRotation = this.keyframes[this.nextKF]["rotation"];

            this.startScale = this.keyframes[this.actualKF]["scale"];
            this.endScale = this.keyframes[this.nextKF]["scale"];
        }

        // Calculate interpolated transfomation values
        let translationValues = linearInterpolation(time, this.startTranslation, this.endTranslation);
        let rotationValues = linearInterpolation(time, this.startRotation, this.endRotation);
        let scaleValues = linearInterpolation(time, this.startScale, this.endScale);

        this.Ma.translate(this.Ma, this.Ma, translationValues);

        this.resultMatrix = mat4.rotate(this.Ma, this.Ma, rotationValues[0], [1 ,0, 0]);
        this.resultMatrix = mat4.rotate(this.Ma, this.Ma, rotationValues[1], [0, 1, 0]);
        this.resultMatrix = mat4.rotate(this.Ma, this.Ma, rotationValues[2], [0, 0, 1]);

        this.resultMatrix = mat4.scale(this.resultMatrix, this.resultMatrix, scaleValues);
    }

    apply() {
        // Apply animation matrix to scene
        this.scene.multMatrix(this.Ma);
    }

    linearInterpolation(time, startTransformation, endTransformation) {
        let result = vec3.create();

        t = (time - this.startTime) / (this.endTime - this.startTime);

        return lerp(result, startTransformation, endTransformation, t);
    }
}