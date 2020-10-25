/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x         - x coordinate of the center
 * @param y         - y coordinate of the center
 * @param z         - z coordinate of the center
 * @param stacks    - number of divisions between the center and the poles
 * @param slices    - number of divisions around axis
 */
class MySphere extends CGFobject {
    constructor(scene, radius, stacks, slices) {
        super(scene);
        this.radius = radius;
        this.latDivs = 2 * stacks;
        this.lonDivs = slices;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = []; // North to south, from longitude 0 | faces pointing outwards
        this.normals = []; // facing outwards
        this.texCoords = [];

        var phi = 0; // azimuth
        var theta = 0; // inclination
        var phiInc = (2 * Math.PI) / this.lonDivs;
        var thetaInc = Math.PI / this.latDivs;
        var latVertices = this.lonDivs + 1;

        for (let lat = 0; lat <= this.latDivs; lat++) {
            var sinTheta = Math.sin(theta);
            var cosTheta = Math.cos(theta);

            phi = 0;

            for (let lon = 0; lon <= this.lonDivs; lon++) {
                // Vertices
                var x = this.radius * sinTheta * Math.cos(phi);
                var y = this.radius * sinTheta * Math.sin(phi);
                var z = this.radius * cosTheta;

                this.vertices.push(x, y, z);
                // Indices
                if (lat < this.latDivs && lon < this.lonDivs) {
                    var current = lat * latVertices + lon;
                    var nextBelow = current + latVertices;

                    this.indices.push(current, nextBelow, current + 1); // upper triangle, facing outwards
                    this.indices.push(nextBelow, nextBelow + 1, current + 1); // bottom triangle, facing outwards
                }

                // Normals (normalized)
                this.normals.push(x / this.radius, y / this.radius, z / this.radius);
                
                // Texture Coords
                this.texCoords.push(lon / this.lonDivs, lat / this.latDivs);

                // Azimuth increment
                phi += phiInc;
            }

            // Inclination increment
            theta += thetaInc;
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