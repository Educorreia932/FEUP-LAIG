class MyKeyframeAnimation extends Animation {
    constructor(scene, keyframes, interpolations) {
        super();
        this.scene = scene;
        this.keyframes = keyframes;

        this.interpolations = interpolations || Array(this.keyframes.length).fill(this.linearInterpolation);

        this.actualKF = 0;
        this.nextKF = 1;
        this.started = false;
        this.ended = false;

        this.Ma = mat4.create();

        if (keyframes.length == 1) {
            // Create animation matrix
            let translation = this.keyframes[this.actualKF]["translation"];

            let rotation = this.keyframes[this.actualKF]["rotation"];

            let scale = this.keyframes[this.actualKF]["scale"];

            this.Ma = mat4.translate(this.Ma, this.Ma, translation);

            this.Ma = mat4.rotate(this.Ma, this.Ma, rotation[0], [1 ,0, 0]);
            this.Ma = mat4.rotate(this.Ma, this.Ma, rotation[1], [0, 1, 0]);
            this.Ma = mat4.rotate(this.Ma, this.Ma, rotation[2], [0, 0, 1]);

            this.Ma = mat4.scale(this.Ma, this.Ma, scale);
        }
    }

    update(time) {
        if (this.ended)
            return; 
        
        if (!this.started && time >= this.keyframes[0]["instant"])
            this.started = true;

        if (!this.started) return;

        // Update current and next keyframes
        // When the update function is called, a keyframe might be skipped, that's why the while cycle is needed
        // TODO: move down?
        while (time >= this.keyframes[this.actualKF]["instant"]) {
            // Animation ended
            if (this.nextKF >= this.keyframes.length) {
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

            this.actualKF++;
            this.nextKF++;
        }

        console.log('TIMES')
        console.log(this.startInstant)
        console.log(this.endInstant)

        // Create animation matrix
        this.Ma = mat4.create();

        // Calculate interpolated transfomation values
        let t = (time - this.startInstant) / (this.endInstant - this.startInstant);
        let translationValues = this.interpolations[this.actualKF](t, this.startTranslation, this.endTranslation);
        let rotationValues = this.interpolations[this.actualKF](t, this.startRotation, this.endRotation);
        let scaleValues = this.interpolations[this.actualKF](t, this.startScale, this.endScale);
        
        console.log('Before');
        console.log(this.Ma);
        console.log(translationValues);
        this.Ma = mat4.translate(this.Ma, this.Ma, translationValues);

        this.Ma = mat4.rotate(this.Ma, this.Ma, rotationValues[0], [1 ,0, 0]);
        this.Ma = mat4.rotate(this.Ma, this.Ma, rotationValues[1], [0, 1, 0]);
        this.Ma = mat4.rotate(this.Ma, this.Ma, rotationValues[2], [0, 0, 1]);

        this.Ma = mat4.scale(this.Ma, this.Ma, scaleValues);
        console.log('After');
        console.log(this.Ma);
    }

    apply() {
        // Apply animation matrix to scene
        this.scene.multMatrix(this.Ma);
    }

    linearInterpolation(t, startTransformation, endTransformation) {
        let result = vec3.create();

        return vec3.lerp(result, startTransformation, endTransformation, t);
    }
}