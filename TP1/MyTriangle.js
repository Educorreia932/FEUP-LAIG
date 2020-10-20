/**
 * MyRectangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3, afs, aft) {
        super(scene);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2,
        this.x3 = x3;
		this.y3 = y3;
		this.afs = afs;
		this.aft = aft;

		this.initBuffers();
	}
	
	initBuffers() {
        let a = Math.sqrt(Math.pow((this.x2 - this.x1), 2) + Math.pow((this.y2 - this.y1), 2));
        let b = Math.sqrt(Math.pow((this.x3 - this.x2), 2) + Math.pow((this.y3 - this.y2), 2));
        let c = Math.sqrt(Math.pow((this.x3 - this.x1), 2) + Math.pow((this.y3 - this.y1), 2));

		let cosAlpha = (Math.pow(a, 2) - Math.pow(b, 2) + Math.pow(c, 2)) / (2 * a * c);
		let sinAlpha = Math.sqrt(1 - Math.pow(cosAlpha, 2));

        this.vertices = [
            this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0,	//2
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		];

        this.indices = [
            0, 1, 2
		];
		
		this.texCoords = [
			0, 0,
			a / this.afs, 0,
			c * cosAlpha / this.afs, c * sinAlpha / this.aft
		];

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

