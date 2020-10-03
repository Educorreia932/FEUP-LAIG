/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x1 - x coordinate corner 1
 * @param y1 - y coordinate corner 1
 * @param x2 - x coordinate corner 2
 * @param y2 - y coordinate corner 2
 */

// Node Type
var NULL = 0;
var REFERENCE = 2;

class MyNode {
    constructor(scene) {
        this.scene = scene;
        // Node Info
        this.id = null;

        // Material Info
        this.material = null;

        // Texture Info
        this.texture = null;

        // Transformation Matrix
        this.transformation = null;

        // Descendants
        this.descedants = [];

        // Primitives
        this.objects = [];
    }

    addDescedant(descendant) {
        this.descedants.push(descendant);
    }

    addObject(object) {
        this.objects.push(object);
        this.descedants.push(object);
    }

    initialize(nodes, materials, textures) {
        /**if (typeof this.material == "string") {
            if (materials[this.material] != null) {
                this.material = materials[this.material];
            }
        }

        if (typeof this.texture.id == "string") {
            if (materials[this.material] != null) {
                this.material = materials[this.material];
            }
        }**/

        var aux = [];

        for (let i = 0; i < this.descedants.length; i++) {
            if (typeof this.descedants[i] == "string") {
                if (nodes[this.descedants[i]] != null)
                    aux.push(nodes[this.descedants[i]]);
            } else {
                aux.push(this.descedants[i]);
            }
        }

        this.descedants = aux;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.multMatrix(this.transformation);

        for (let i = 0; i < this.descedants.length; i++)
            this.descedants[i].display();

        this.scene.popMatrix();
    }
}