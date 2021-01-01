class CameraAnimation extends MyAnimation {

    constructor(scene, initialCamera, endCamera, timeLength) {
        super();
        this.scene = scene;
        this.timeLength = timeLength;

        this.initialPosition = initialCamera.position;
        this.initialTarget = initialCamera.target;
        this.initialNear = initialCamera.near;
        this.initialFar = initialCamera.far;
        this.initialFOV = initialCamera.fov;

        this.currentPosition = initialCamera.position;
        this.currentTarget = initialCamera.target;
        this.currentDirection = initialCamera.direction;
        this.currentNear = initialCamera.near;
        this.currentFar = initialCamera.far;
        this.currentFOV = initialCamera.fov;

        this.endPosition = endCamera.position;
        this.endTarget = endCamera.target;
        this.endNear = endCamera.near;
        this.endFar = endCamera.far;
        this.endFOV = endCamera.fov;

        this.elapsed = 0;
        this.ended = false;
        this.forceApply = false;
    }

    update(time) {
        if (this.ended) return;
        this.elapsed += time;

        if (this.elapsed > this.timeLength) {
            this.forceApply = true;
            this.ended = true;

            this.currentPosition = this.endPosition;
            this.currentTarget = this.endTarget;
            this.currentNear = this.endNear;
            this.currentFar = this.endFar;
            this.currentFOV = this.endFOV;

        }

        let percent = (this.timeLength - this.elapsed) / this.timeLength;

        let pos_x = this.interpolation(this.endPosition[0], this.initialPosition[0], percent);
        let pos_y = this.interpolation(this.endPosition[1], this.initialPosition[1], percent);
        let pos_z = this.interpolation(this.endPosition[2], this.initialPosition[2], percent);

        let target_x = this.interpolation(this.endTarget[0], this.initialTarget[0], percent);
        let target_y = this.interpolation(this.endTarget[1], this.initialTarget[1], percent);
        let target_z = this.interpolation(this.endTarget[2], this.initialTarget[2], percent);

        this.currentPosition = vec3.fromValues(pos_x, pos_y, pos_z);
        this.currentTarget = vec3.fromValues(target_x, target_y, target_z);
        this.currentNear = this.interpolation(this.initialNear, this.endNear, percent);
        this.currentFar = this.interpolation(this.initialFar, this.endFar, percent);
        this.currentFOV = this.interpolation(this.initialFOV, this.endFOV, percent);

    }

    apply() {
        if (this.ended && !this.forceApply) return;
        this.scene.camera = new CGFcamera(this.currentFOV, this.currentNear, this.currentFar,
                                            this.currentPosition, this.currentTarget);
        this.scene.interface.setActiveCamera(this.scene.camera);
        this.forceApply = false;
    }

    interpolation(x0, x1, delta_t) {
        let f = 1 - Math.cos((delta_t * Math.PI) / 2);
        return x0 + f * (x1 - x0);
    }

}