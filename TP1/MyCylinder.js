/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */
class MyCylinder extends CGFobject {
	constructor(scene, bottomRadius, topRadius, height, slices, stacks) {
		super(scene);
		this.bottomRadius = bottomRadius;
		this.topRadius = topRadius;
		this.height = height;
        this.slices = slices;
        this.stacks = stacks;

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var currentIndex = 2; // Skip the lids'
        var phi = 0;
        const phiInc = (Math.PI * 2) / this.slices;

        // Lids' center
        this.vertices.push(0, 0, 0);
        this.vertices.push(0, 0, this.height);

        this.normals.push(0, 0, 0);
        this.normals.push(0, 0, 0);

        for (let div = 0; div <= this.slices; div++) {
            let cosPhi = Math.cos(phi);
            let sinPhi = Math.sin(phi);

            var x0 = cosPhi * this.bottomRadius;
            var y0 = sinPhi * this.bottomRadius;

            var x1 = cosPhi * this.topRadius;
            var y1 = sinPhi * this.topRadius;

            this.vertices.push(x0, y0, 0);
            this.vertices.push(x1, y1, this.height);

            if (div < this.slices) {
                this.indices.push(currentIndex + 2, currentIndex + 1, currentIndex);
                this.indices.push(currentIndex + 1, currentIndex + 2, currentIndex + 3);

                currentIndex += 2;
            }

            this.normals.push(cosPhi, sinPhi, -1);
            this.normals.push(cosPhi, sinPhi, 1);

            phi += phiInc;
        }

        var currentIndex = 2;

        // Lids
        for (let div = 0; div < this.slices; div++) {
            this.indices.push(currentIndex + 2, currentIndex, 0); // Bottom lid
            this.indices.push(1, currentIndex + 1, currentIndex + 3); // Top lid

            currentIndex += 2;
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	}   

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 */
	updateTexCoords(coords) {
		this.texCoords = [...coords];
		this.updateTexCoordsGLBuffers();
    }
}

