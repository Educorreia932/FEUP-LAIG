/**
 * MyNode
 * @constructor
 * @param scene - Reference to MyScene object
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

        // Parent node
        this.parent = null;

        // Descendants
        this.descendants = [];

        // Primitives
        this.objects = [];
    }

    addDescendant(descendant) {
        this.descendants.push(descendant);
    }

    addObject(object) {
        this.objects.push(object);
        this.descendants.push(object);
    }

    initialize(nodes, parents, materials, textures) {
        var aux = [];

        if (this.id != null && parents[this.id] != null) {
            this.parent = nodes[parents[this.id]];
        }

        // Replace ID references by MyNode object references on descendants
        for (let i = 0; i < this.descendants.length; i++) {
            if (typeof this.descendants[i] == "string") {
                if (nodes[this.descendants[i]] != null) {
                    let descendant = this.descendants[i];
                    aux.push(nodes[descendant]);
                }
            } 
            
            else {
                aux.push(this.descendants[i]);
            }
        }

        this.descendants = aux;

        // Material
        if (typeof this.material == "string")
            if (materials[this.material] != null)
                this.material = materials[this.material];

        // Texture
        if (typeof this.texture.id == "string") {
            if (textures[this.texture.id] != null) {
                this.texture = textures[this.texture.id];
            }
        }

        // Apply to descendants
        for (let i = 0; i < this.descendants.length; i++) {
            if (this.descendants[i].texture == "null")
                this.descendants[i].texture = this.texture ;

            if (this.descendants[i].material == "null")
                this.descendants[i].material = this.material;
        }

        console.log(this.id)
        console.log(this.material)
    }

    display() {
        this.scene.pushMatrix();

        if (this.material != null) {
            this.material.apply();
        }

        if (this.texture instanceof CGFtexture) {
            this.texture.bind();
        }

        this.scene.multMatrix(this.transformation);

        for (let i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display();
        }

        this.scene.popMatrix();

        if (this.texture instanceof CGFtexture) {
            this.texture.unbind();
        }
    }
}