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

        this.material = new CGFappearance(this.scene);	
        this.material.setAmbient(1.0, 1.0, 1.0, 1.0);
        this.material.setDiffuse(0.9, 0.9, 0.9, 1);
        this.material.setSpecular(0.1, 0.1, 0.1, 1);
        this.material.setShininess(10.0);
        this.terrainTexture = new CGFtexture(this.scene, "scenes/images/earth.jpg");
        this.material.setTexture(this.terrainTexture);

		this.initBuffers();
	}
	
	initBuffers() {
		this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        var currentIndex = 0;
        var xCoord = 0.0;
        var phi = 0;
        var height = 0;
        const phiInc = (Math.PI * 2) / this.slices;
        const heightInc = this.height / this.stacks;

        for (let stack = 0; stack <= this.stacks; stack++) {
            phi = 0;

            for (let div = 0; div <= this.slices; div++) {
                let cosPhi = Math.cos(phi);
                let sinPhi = Math.sin(phi);
    
                var x = cosPhi * this.bottomRadius;
                var y = sinPhi * this.bottomRadius;
    
                this.texCoords.push(xCoord, (height + heightInc) / this.height);
                this.texCoords.push(xCoord, height / this.height);
    
                this.vertices.push(x, y, height);
    
                if (stack > 0) {
                    this.indices.push(currentIndex, currentIndex + this.slices + 1, currentIndex + this.slices);
                    this.indices.push(currentIndex, currentIndex + 1, currentIndex + this.slices + 1);

                    currentIndex += 1;
                }
                
                // this.indices.push(currentIndex + 2, currentIndex, this.slices * 2); // Bottom lid
                // this.indices.push(this.slices * 2 + 1, currentIndex + 1, currentIndex + 3); // Top lid
    
                this.normals.push(cosPhi, sinPhi, -1);
                this.normals.push(cosPhi, sinPhi, 1);

                phi += phiInc;

                xCoord += 1 / this.slices;
            }

            height += heightInc;
        }

        // Lids' center
        this.vertices.push(0, 0, 0);
        this.vertices.push(0, 0, this.height);

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

    display() {
        this.material.apply();
        super.display();
    }
}

