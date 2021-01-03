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

        // Animation
        this.animation = null;

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

    initialize(parser) {
        if (this.inited)
            return;

        var auxDesc = [];
        var auxObj = [];

        // Replace ID references by MyNode object references on descendants
        for (let i = 0; i < this.descendants.length; i++) {
            let descendant = this.descendants[i];
            if (typeof descendant == "string") {
                if (parser.nodes[descendant] != null) {
                    auxDesc.push(parser.nodes[descendant]);
                } else {
                    parser.onXMLMinorError("invalid descendant for node of ID " + this.id);
                }
            } 
            
            else if (descendant instanceof CGFobject) {
                if (descendant instanceof MySpriteAnimation) {
                    if (parser.spritesheets[descendant.spritesheet] == null) {
                        parser.onXMLMinorError("invalid spritesheet for spriteanimation for node of ID " + this.id);
                        continue;
                    }

                    descendant.spritesheet = parser.spritesheets[descendant.spritesheet];
                }

                auxDesc.push(descendant);
                auxObj.push(descendant);
            }
        }

        this.descendants = auxDesc;
        this.objects = auxObj;

        // Animation
        if (typeof this.animation == "string") {
            if (parser.animations[this.animation] != null) {
                this.animation = parser.animations[this.animation];
            } else if (this.animation != "null") {
                this.animation = null;
                parser.onXMLMinorError("invalid animation for node " + this.id);
            }
        }

        // Material
        if (typeof this.material == "string") {
            if (parser.materials[this.material] != null) {
                this.material = parser.materials[this.material];
            } else if (this.material != "null") {
                this.material = parser.errorMaterial;
                parser.onXMLMinorError("invalid material for node " + this.id + ";applying error material");
            }
        }

        // Texture
        if (typeof this.texture.id == "string") {
            if (parser.textures[this.texture.id] != null) {
                this.texture = parser.textures[this.texture.id];
            } else if (this.texture.id != "null" && this.texture.id != "clear") {
                this.texture = parser.errorTexture;
                parser.onXMLMinorError("invalid texture for node " + this.id + ";applying error texture");
            } else {
                this.texture = this.texture.id;
            }
        }

        for (let i = 0; i < this.descendants.length; i++) {
            if (this.descendants[i] instanceof MyNode)
                this.descendants[i].initialize(parser);
        }

        this.inited = true;
    }

    update(time) {
        for (const [objectID, object] of Object.entries(this.objects))
            if (object instanceof MySpriteAnimation)
                object.update(time);
    }

    display() {
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
        if (this.material instanceof CGFappearance) {
            this.scene.pushMaterial(this.material);
        }

        if (this.texture instanceof CGFtexture) {
            this.scene.pushTexture(this.texture);

        } else if (this.texture == "clear") { // Texture clear
            this.scene.pushTexture(null);
        }

        this.scene.pushMatrix();

        this.scene.multMatrix(this.transformation);

        if (this.animation != null) {
            this.animation.apply();
        }

        if (this.animation == null || this.animation.started) {
            if (this.id == "gameBoard")
                this.scene.gameOrchestrator.display();
        
            for (let i = 0; i < this.descendants.length; i++)
                this.descendants[i].display();
        }

        this.scene.popMatrix();

        if (this.texture instanceof CGFtexture || this.texture == "clear") {
            this.scene.popTexture();
        }

        if (this.material instanceof CGFappearance) {
            this.scene.popMaterial();
        }
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}