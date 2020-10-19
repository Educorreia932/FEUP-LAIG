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

        this.inited = false;
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

    initialize(nodes, materials, textures, parent) {
        if (this.inited)
            return;

        var aux = [];

        // Replace ID references by MyNode object references on descendants
        for (let i = 0; i < this.descendants.length; i++) {
            let descendant = this.descendants[i];
            if (typeof descendant == "string") {
                if (nodes[descendant] != null) {
                    aux.push(nodes[descendant]);
                }
            } 
            
            else if (descendant instanceof CGFobject) {
                aux.push(descendant);
            }
        }

        this.descendants = aux;

        this.parent = parent;

        // Material
        if (this.parent == null) {
            if (typeof this.material == "string") {
                if (materials[this.material] != null)
                    this.material = materials[this.material];
                else
                    this.material = null;
            }
        } else {
            if (typeof this.material == "string") {
                if (this.material == "null") {
                    this.material = this.parent.material;
                } else if (materials[this.material] != null)
                    this.material = materials[this.material];
                else
                    this.material = null;
            }
        }

        // Texture
        if (this.parent == null) {
            if (typeof this.texture.id == "string") {
                if (textures[this.texture.id] != null) {
                    this.texture = textures[this.texture.id];
                } else {
                    this.texture = null;
                }
            }
        } else {
            if (typeof this.texture.id == "string") {
                if (this.texture.id == "null") {
                    this.texture = this.parent.texture;
                } else if (textures[this.texture.id] != null)
                    this.texture = textures[this.texture.id];
                else
                    this.texture = null;
            }
        }

        for (let i = 0; i < this.descendants.length; i++) {
            if (this.descendants[i] instanceof MyNode) {
                this.descendants[i].initialize(nodes, materials, textures, this);
            }
        }

        this.inited = true;
    }

    display() {

        this.scene.pushMatrix();

        if (this.material != null) {
            this.material.apply();
        }

        if (this.texture instanceof CGFtexture) {
            this.texture.bind();
        } else if (this.texture == null) {
            if (this.parent != null && this.parent.texture != null)
                this.parent.texture.unbind();
        }

        this.scene.multMatrix(this.transformation);

        for (let i = 0; i < this.descendants.length; i++) {
            this.descendants[i].display();
        }

        if (this.texture instanceof CGFtexture) {
            this.texture.unbind();
        }
        if (this.parent != null) {
            if (this.parent.material != null)
                this.parent.material.apply();
            if (this.parent.texture != null)
                this.parent.texture.bind();
        }

        this.scene.popMatrix();
    }
}