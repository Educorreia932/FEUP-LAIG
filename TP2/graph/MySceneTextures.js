class MySceneTextures {
    constructor(graph) {
        this.graph = graph;
        this.scene = graph.scene;
    }

    parse(children) {
        let textures = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.graph.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }
    
            let textureID = this.graph.reader.getString(children[i], 'id');
    
            if (textureID == null)
                return "No ID defined for texture";
    
            if (textures[textureID] != null)
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
    
            let texturePath = this.graph.reader.getString(children[i], 'path');
    
            if (texturePath == null)
                return "No path defined for texture";
    
            let texture = new CGFtexture(this.scene, texturePath);
    
            textures[textureID] = texture;
        }

        return textures;
    }
}