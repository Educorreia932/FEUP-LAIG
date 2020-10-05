/**
 * MySphere
 * @constructor
 * @param scene      - Reference to MyScene object
 * @param inner      - Inner radius
 * @param outer      - Outer radius
 * @param slices     - Number of slices around the inner radius
 * @param loops      - number of loops around the outer radius
 */
class MyTorus extends CGFobject {
    constructor(scene, inner, outer, slices, loops) {
        super(scene);
        this.inner = inner;
        this.outer = outer;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = []; 
        this.normals = []; // Facing outwards
        this.texCoords = [];

        let currentIndex = 0;

        let theta = 0; // Inner angle
        let phi = 0; // Outer angle

        const thetaIncrement = (Math.PI * 2) / this.slices;
        const phiIncrement = (Math.PI * 2) / this.loops;

        for (let loop = 0; loop < this.loops; loop++) {
            theta = 0;

            for (let slice = 0; slice < this.slices; slice++) {
                let cosTheta = Math.cos(theta);
                let sinTheta = Math.sin(theta);

                let cosPhi = Math.cos(phi);
                let sinPhi = Math.sin(phi);

                let x = cosTheta * this.inner * cosPhi * this.outer;
                let y = sinPhi * this.outer;
                let z = sinTheta * this.inner * cosPhi * this.outer;

                this.vertices.push(x, y, z);

                // Connect the current loop with the previous one
                if (loop > 0) {
                    this.indices.push(currentIndex, currentIndex + this.slices + 1, currentIndex + this.slices);
                    this.indices.push(currentIndex, currentIndex + 1, currentIndex + this.slices + 1);

                    currentIndex += 1;
                }

                theta += thetaIncrement;
                phi += phiIncrement;
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the sphere
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
	}
}