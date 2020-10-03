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
        this.descendants = [];

        // Primitives
        this.objects = [];
    }

    addDescedant(descendant) {
        this.descendants.push(descendant);
    }

    addObject(object) {
        this.objects.push(object);
        this.descendants.push(object);
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

        for (let i = 0; i < this.descendants.length; i++) {
            if (typeof this.descendants[i] == "string") {
                if (nodes[this.descendants[i]] != null)
                    aux.push(nodes[this.descendants[i]]);
            } else {
                aux.push(this.descendants[i]);
            }
        }

        this.descendants = aux;
    }

    display() {
        this.scene.pushMatrix();

        this.scene.multMatrix(this.transformation);

        for (let i = 0; i < this.descendants.length; i++)
            this.descendants[i].display();

        this.scene.popMatrix();
    }
}