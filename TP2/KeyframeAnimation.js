class KeyframeAnimation extends Animation {
    constructor(scene, keyframes) {
        super();
        this.scene = scene;
        this.keyframes = keyframes;

        this.actualKF = 0;
        this.nextKF = 1;
        this.ended = false;

        if (keyframes.length == 1) {
            // Create animation matrix
            this.Ma = mat4.create();

            let translation = this.keyframes[this.actualKF]["translation"];

            let rotation = this.keyframes[this.actualKF]["rotation"];

            let scale = this.keyframes[this.actualKF]["scale"];

            this.Ma = mat4.translate(this.Ma, this.Ma, translation);

            this.Ma = mat4.rotate(this.Ma, this.Ma, rotation[0], [1 ,0, 0]);
            this.Ma = mat4.rotate(this.Ma, this.Ma, rotation[1], [0, 1, 0]);
            this.Ma = mat4.rotate(this.Ma, this.Ma, rotation[2], [0, 0, 1]);

            this.Ma = mat4.scale(this.Ma, this.Ma, scale);

            this.ended = true;
        }
    }

    update(time) {
        if (this.ended)
            return; 
        
        // Update current and next keyframes
        // When the update function is called, a keyframe might be skipped, that's why the while cycle is needed
        while (time >= this.keyframes[this.nextKF]["instant"]) {
            this.actualKF++;
            this.nextKF++;

            // Animation ended
            if (this.nextKF == this.keyframes.length) {
                this.ended = true;
                
                return;
            }

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

        // Create animation matrix
        this.Ma = mat4.create();

        // Calculate interpolated transfomation values
        let translationValues = linearInterpolation(time, this.startTranslation, this.endTranslation);
        let rotationValues = linearInterpolation(time, this.startRotation, this.endRotation);
        let scaleValues = linearInterpolation(time, this.startScale, this.endScale);

        this.Ma = mat4.translate(this.Ma, this.Ma, translationValues);

        this.Ma = mat4.rotate(this.Ma, this.Ma, rotationValues[0], [1 ,0, 0]);
        this.Ma = mat4.rotate(this.Ma, this.Ma, rotationValues[1], [0, 1, 0]);
        this.Ma = mat4.rotate(this.Ma, this.Ma, rotationValues[2], [0, 0, 1]);

        this.Ma = mat4.scale(this.Ma, this.Ma, scaleValues);
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