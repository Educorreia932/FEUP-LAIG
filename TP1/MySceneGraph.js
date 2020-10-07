const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var MATERIALS_INDEX = 5;
var NODES_INDEX = 6;

/**
 * MySceneGraph class, representing the scene graph.
 */
class MySceneGraph {
    /**
     * Constructor for MySceneGraph class.
     * Initializes necessary variables and starts the XML file reading process.
     * @param {string} filename - File that defines the 3D scene
     * @param {XMLScene} scene
     */
    constructor(filename, scene) {
        this.loadedOk = null;

        // Establish bidirectional references between scene and graph.
        this.scene = scene;
        scene.graph = this;

        this.cameras = [];

        this.defaultCamera = null; // The id of the default camera.

        this.nodes = [];
        this.parents = [];
        this.textures = [];
        this.materials = [];

        this.idRoot = null; // The id of the root element.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);

        scene.enableTextures(true);

        // R2-D2 
        this.head = new MySphere(scene, 3.5, 50, 50);
        this.bodyTop = new MyCylinder(scene, 3.5, 3.5, 10, 50, 5);
        this.bodyBottom = new MyCylinder(scene, 3, 3.5, 2, 50, 5);
        this.legTopCircle = new MyCylinder(scene, 2, 2, 2, 50, 5);
        this.legTopRectangle = new MyCylinder(scene, 1.41421, 1.41421, 5, 4, 5);
        this.legBottom = new MyCylinder(scene, 0.70711, 0.70711, 3, 4, 5);
        this.foot = new MyCylinder(scene, 1.7678, 0.70711, 2, 4, 5);
        this.footSupport = new MyCylinder(scene, 0.4, 0.4, 1, 50, 5);
    }

    /*
     * Callback to be executed after successful reading
     */
    onXMLReady() {
        this.log("XML Loading finished.");
        var rootElement = this.reader.xmlDoc.documentElement;

        // Here should go the calls for different functions to parse the various blocks
        var error = this.parseXMLFile(rootElement);

        if (error != null) {
            this.onXMLError(error);
            return;
        }

        this.loadedOk = true;

        // As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
        this.scene.onGraphLoaded();
    }

    /*
     * Callback to be executed on any read error, showing an error on the console.
     * @param {string} message
     */
    onXMLError(message) {
        console.error("XML Loading Error: " + message);
        this.loadedOk = false;
    }

    /**
     * Callback to be executed on any minor error, showing a warning on the console.
     * @param {string} message
     */
    onXMLMinorError(message) {
        console.warn("Warning: " + message);
    }

    /**
     * Callback to be executed on any message.
     * @param {string} message
     */
    log(message) {
        console.log("   " + message);
    }

    /**
     * Parses the XML file, processing each block.
     * @param {XML root element} rootElement
     */
    parseXMLFile(rootElement) {
        if (rootElement.nodeName != "lsf")
            return "root tag <lsf> missing";

        var nodes = rootElement.children;

        // Reads the names of the nodes to an auxiliary buffer.
        var nodeNames = [];

        for (var i = 0; i < nodes.length; i++) {
            nodeNames.push(nodes[i].nodeName);
        }

        var error;

        // Processes each node, verifying errors.

        // <initials>
        var index;

        if ((index = nodeNames.indexOf("initials")) == -1)
            return "tag <initials> missing";
        
        else {
            if (index != INITIALS_INDEX)
                this.onXMLMinorError("tag <initials> out of order " + index);

            //Parse initials block
            if ((error = this.parseInitials(nodes[index])) != null)
                return error;
        }

        // <views>
        if ((index = nodeNames.indexOf("views")) == -1)
            return "tag <views> missing";
        
        else {
            if (index != VIEWS_INDEX)
                this.onXMLMinorError("tag <views> out of order");

            //Parse views block
            if ((error = this.parseViews(nodes[index])) != null)
                return error;
        }

        // <illumination>
        if ((index = nodeNames.indexOf("illumination")) == -1)
            return "tag <illumination> missing";
        
        else {
            if (index != ILLUMINATION_INDEX)
                this.onXMLMinorError("tag <illumination> out of order");

            //Parse illumination block
            if ((error = this.parseIllumination(nodes[index])) != null)
                return error;
        }

        // <lights>
        if ((index = nodeNames.indexOf("lights")) == -1)
            return "tag <lights> missing";
        
        else {
            if (index != LIGHTS_INDEX)
                this.onXMLMinorError("tag <lights> out of order");

            //Parse lights block
            if ((error = this.parseLights(nodes[index])) != null)
                return error;
        }
        
        // <textures>
        if ((index = nodeNames.indexOf("textures")) == -1)
            return "tag <textures> missing";
        
        else {
            if (index != TEXTURES_INDEX)
                this.onXMLMinorError("tag <textures> out of order");

            //Parse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <materials>
        if ((index = nodeNames.indexOf("materials")) == -1)
            return "tag <materials> missing";
        
        else {
            if (index != MATERIALS_INDEX)
                this.onXMLMinorError("tag <materials> out of order");

            //Parse materials block
            if ((error = this.parseMaterials(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";

        else {
            if (index != NODES_INDEX)
                this.onXMLMinorError("tag <nodes> out of order");

            //Parse nodes block
            if ((error = this.parseNodes(nodes[index])) != null)
                return error;
        }

        this.log("all parsed");
    }

    /**
     * Parses the <initials> block. 
     * @param {initials block element} initialsNode
     */
    parseInitials(initialsNode) {
        var children = initialsNode.children;
        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var rootIndex = nodeNames.indexOf("root");
        var referenceIndex = nodeNames.indexOf("reference");

        // Get root of the scene.
        if(rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');
        
        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if(referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');

        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = axis_length || 1;

        this.log("Parsed initials");

        return null;
    }

    /**
     * Parses the <views> block.
     * @param {view block element} viewsNode
     */
    parseViews(viewsNode) {
        var children = viewsNode.children;

        var defaultCam = this.reader.getString(viewsNode, 'default');

        if (defaultCam == null) {
            return "No default camera defined for scene.";
        }

        var numcams = 0;

        for (let i = 0; i < children.length; i++) {
            var cameraID = this.reader.getString(children[i], 'id');

            if (cameraID == null)
                return "no ID defined for camera";

            // Checks for repeated IDs.
            if (this.cameras[cameraID] != null)
                return "ID must be unique for each camera (conflict: ID = " + cameraID + ")";

            var camera = this.parseCamera(children[i], "ID " + cameraID);

            if (typeof camera == "string")
                continue;

            this.cameras[cameraID] = camera;
            numcams++;
        }

        if (numcams == 0)
            return "at least one camera must be defined";

        this.log("Parsed Views");

        return null;
    }

    /**
     * Parses the <illumination> node.
     * @param {illumination block element} illuminationsNode
     */
    parseIllumination(illuminationsNode) {
        var children = illuminationsNode.children;

        this.ambient = [];
        this.background = [];

        var nodeNames = [];

        for (var i = 0; i < children.length; i++)
            nodeNames.push(children[i].nodeName);

        var ambientIndex = nodeNames.indexOf("ambient");
        var backgroundIndex = nodeNames.indexOf("background");

        var color = this.parseColor(children[ambientIndex], "ambient");
        if (!Array.isArray(color))
            return color;
        else
            this.ambient = color;

        color = this.parseColor(children[backgroundIndex], "background");
        if (!Array.isArray(color))
            return color;
        else
            this.background = color;

        this.log("Parsed Illumination.");

        return null;
    }

    /**
     * Parses the <light> node.
     * @param {lights block element} lightsNode
     */
    parseLights(lightsNode) {
        var children = lightsNode.children;

        this.lights = [];
        var numLights = 0;

        var grandChildren = [];
        var nodeNames = [];

        // Any number of lights.
        for (var i = 0; i < children.length; i++) {
            // Storing light information
            var global = [];
            var attributeNames = [];
            var attributeTypes = [];

            //Check type of light
            if (children[i].nodeName != "light") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            else {
                attributeNames.push(...["enable", "position", "ambient", "diffuse", "specular"]);
                attributeTypes.push(...["boolean","position", "color", "color", "color"]);
            }

            // Get id of the current light.
            var lightId = this.reader.getString(children[i], 'id');

            if (lightId == null)
                return "no ID defined for light";

            // Checks for repeated IDs.
            if (this.lights[lightId] != null)
                return "ID must be unique for each light (conflict: ID = " + lightId + ")";

            grandChildren = children[i].children;

            // Specifications for the current light.
            nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            for (var j = 0; j < attributeNames.length; j++) {
                var attributeIndex = nodeNames.indexOf(attributeNames[j]);

                if (attributeIndex != -1) {
                    if (attributeTypes[j] == "boolean")
                        var aux = this.parseBoolean(grandChildren[attributeIndex], "value", "enabled attribute for light of ID" + lightId);
                    
                    else if (attributeTypes[j] == "position")
                        var aux = this.parseCoordinates4D(grandChildren[attributeIndex], "light position for ID" + lightId);
                    
                    else
                        var aux = this.parseColor(grandChildren[attributeIndex], attributeNames[j] + " illumination for ID" + lightId);

                    if (typeof aux === 'string')
                        return aux;

                    global.push(aux);
                }

                else
                    return "light " + attributeNames[i] + " undefined for ID = " + lightId;
            }

            this.lights[lightId] = global;
            numLights++;
        }

        if (numLights == 0)
            return "at least one light must be defined";

        else if (numLights > 8)
            this.onXMLMinorError("too many lights defined; WebGL imposes a limit of 8 lights");

        this.log("Parsed lights");
        return null;
    }

    /**
     * Parses the <textures> block. 
     * @param {textures block element} texturesNode
     */
    parseTextures(texturesNode) {

        var children = texturesNode.children;

        this.textures = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "texture") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            let textureID = this.reader.getString(children[i], 'id');

            if (textureID == null) {
                return "no ID defined for texture";
            }

            if (this.textures[textureID] != null) {
                return "ID must be unique for each texture (conflict: ID = " + textureID + ")";
            }

            let texturePath = this.reader.getString(children[i], 'path');

            if (texturePath == null) {
                return "no path defined for texture";
            }

            var texture = new CGFtexture(this.scene, texturePath);

            this.textures[textureID] = texture;
        }

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        var children = materialsNode.children;

        this.materials = [];

        var components = [];
        var nodeNames = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            let materialID = this.reader.getString(children[i], 'id');

            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (this.materials[materialID] != null)
                return "ID must be unique for each light (conflict: ID = " + materialID + ")";

            components = children[i].children;

            for (var j = 0; j < components.length; j++) {
                nodeNames.push(components[j].nodeName);
            }

            let material = new CGFappearance(this.scene);

            let ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            var emissiveIndex = nodeNames.indexOf("emissive");
            var shininessIndex = nodeNames.indexOf("shininess");

            // Ambient component
            if (ambientIndex != -1) {
                let aux = this.parseColor(components[ambientIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setAmbient(...aux);
            } else {
                return "compenent ambient undefined for material of ID = " + materialID;
            }

            // Diffuse component
            if (diffuseIndex != -1) {
                let aux = this.parseColor(components[diffuseIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setDiffuse(...aux);
            } else {
                return "compenent diffuse undefined for material of ID = " + materialID;
            }

            // Specular component
            if (specularIndex != -1) {
                let aux = this.parseColor(components[specularIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setSpecular(...aux);
            } else {
                return "compenent specular undefined for material of ID = " + materialID;
            }

            // Emissive component
            if (emissiveIndex != -1) {
                let aux = this.parseColor(components[emissiveIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setEmission(...aux);
            } else {
                return "compenent emissive undefined for material of ID = " + materialID;
            }

            // Shininess component
            if (emissiveIndex != -1) {
                let aux = this.reader.getFloat(components[shininessIndex], 'value');

                if (typeof aux == null || isNaN(aux))
                    return "invalid value for shininess component of material of ID " + materialID;

                material.setShininess(aux);
            } else {
                return "compenent shininess undefined for material of ID = " + materialID;
            }

            this.materials[materialID] = material;
        }

        return null;
    }

    /**
   * Parses the <nodes> block.
   * @param {nodes block element} nodesNode
   */
    parseNodes(nodesNode) {
        var children = nodesNode.children;

        this.nodes = [];
        this.parents = [];

        var grandChildren = [];
        var grandgrandChildren = [];
        var nodeNames = [];

        // Any number of nodes.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "node") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get ID of the current node.
            var nodeID = this.reader.getString(children[i], 'id');

            if (nodeID == null)
                return "no ID defined for node number #" + i;

            // Checks for repeated IDs.
            if (this.nodes[nodeID] != null)
                return "ID must be unique for each node (conflict: ID = " + nodeID + ")";

            var node = new MyNode(this.scene);
            node.id = nodeID;

            grandChildren = children[i].children;

            nodeNames = [];

            for (var j = 0; j < grandChildren.length; j++) {
                nodeNames.push(grandChildren[j].nodeName);
            }

            var transformationsIndex = nodeNames.indexOf("transformations");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            // Transformations
            var transfMatrix = mat4.create();

            if (transformationsIndex != -1) {
                let transformations = grandChildren[transformationsIndex].children;

                // Iterate over transformations
                for (let t = transformations.length - 1; t >= 0; t--) {
                    var aux = this.parseTransfMatrix(transformations[t], transfMatrix, "node of ID " + nodeID);

                    if (typeof aux === 'string') // An error occurred
                        return aux;

                    transfMatrix = aux;
                }
            }

            node.transformation = transfMatrix;

            // Material
            var material;

            if (materialIndex != -1) {
                material = this.reader.getString(grandChildren[materialIndex], 'id');

                if (material == null || this.materials[material] == null) {
                    this.onXMLMinorError("no valid material found for node " + nodeID);
                    material = null;
                }
            } else {
                return "material undefined for node " + nodeID;
            }

            node.material = material;

            // Texture
            var texture = {};
            texture.id = null;
            texture.afs;
            texture.aft;

            if (textureIndex != -1) {
                grandgrandChildren = grandChildren[textureIndex].children;

                texture.id = this.reader.getString(grandChildren[textureIndex], 'id');

                if (texture.id == null) {
                    return "unable to parse texture ID for node " + nodeID;
                }

                if (grandgrandChildren.length < 1 || grandgrandChildren[0].nodeName != "amplification") {
                    this.onXMLMinorError("unable to parse texture amplification" + texture.id + "for node " + nodeID + "; assuming amplication of 1.0"); 
                }

                let auxS = this.reader.getFloat(grandgrandChildren[0], 'afs');
                let auxT = this.reader.getFloat(grandgrandChildren[0], 'aft');

                if (auxS == null) {
                    this.onXMLMinorError("unable to parse afs component from the texture of ID " + texture.id + "of the node " + nodeID);
                }

                if (auxT == null) {
                    this.onXMLMinorError("unable to parse aft component from the texture of ID " + texture.id + "of the node " + nodeID);
                }

                texture.afs = auxS || 1.0;
                texture.aft = auxT || 1.0;
            } else {
                return "texture undefined for node of ID " + nodeID;
            }

            node.texture = texture;

            // Descendants
            if (descendantsIndex != -1) {
                grandgrandChildren = grandChildren[descendantsIndex].children;

                for (let i = 0; i < grandgrandChildren.length; i++) {
                    if (grandgrandChildren[i].nodeName == "noderef") {
                        var aux = this.reader.getString(grandgrandChildren[i], 'id');

                        node.addDescendant(aux);
                        this.parents[aux] = nodeID;
                    } 
                    
                    else if (grandgrandChildren[i].nodeName == "leaf") {
                        var aux = this.parsePrimitive(grandgrandChildren[i], "node of ID " + nodeID);
                    
                        if (typeof aux == "string") {
                            return aux;
                        }

                        node.addObject(aux);
                    }
                }
            }

            if (node.descendants.length < 1) {
                return "node of ID " + nodeID + " must have atleast one descendant";
            }

            this.nodes[nodeID] = node;
        }

        for (let key in this.nodes)
            this.nodes[key].initialize(this.nodes, this.parents, this.materials, this.textures);

        this.log("Parsed Nodes.");

        return null;
    }

    parseBoolean(node, name, messageError){
        var boolVal = true;
        
        boolVal = this.reader.getBoolean(node, name);

        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal || 1;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates3D(node, messageError) {
        var position = [];

        // x
        var x = this.reader.getFloat(node, 'x');
        if (!(x != null && !isNaN(x)))
            return "unable to parse x-coordinate of the " + messageError;

        // y
        var y = this.reader.getFloat(node, 'y');
        if (!(y != null && !isNaN(y)))
            return "unable to parse y-coordinate of the " + messageError;

        // z
        var z = this.reader.getFloat(node, 'z');
        if (!(z != null && !isNaN(z)))
            return "unable to parse z-coordinate of the " + messageError;

        position.push(...[x, y, z]);

        return position;
    }

    /**
     * Parse the coordinates from a node with ID = id
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseCoordinates4D(node, messageError) {
        var position = [];

        //Get x, y, z
        position = this.parseCoordinates3D(node, messageError);

        if (!Array.isArray(position))
            return position;


        // w
        var w = this.reader.getFloat(node, 'w');
        if (!(w != null && !isNaN(w)))
            return "unable to parse w-coordinate of the " + messageError;

        position.push(w);

        return position;
    }

    /**
     * Parse the color components from a node
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parseColor(node, messageError) {
        var color = [];

        // R
        var r = this.reader.getFloat(node, 'r');
        if (!(r != null && !isNaN(r) && r >= 0 && r <= 1))
            return "unable to parse R component of the " + messageError;

        // G
        var g = this.reader.getFloat(node, 'g');
        if (!(g != null && !isNaN(g) && g >= 0 && g <= 1))
            return "unable to parse G component of the " + messageError;

        // B
        var b = this.reader.getFloat(node, 'b');
        if (!(b != null && !isNaN(b) && b >= 0 && b <= 1))
            return "unable to parse B component of the " + messageError;

        // A
        var a = this.reader.getFloat(node, 'a');
        if (!(a != null && !isNaN(a) && a >= 0 && a <= 1))
            return "unable to parse A component of the " + messageError;

        color.push(...[r, g, b, a]);

        return color;
    }

    /**
     * Parse a transformation matrix of a node
     * @param {block element} node
     * @param {matrix where result is stored} out
     * @param {message to be displayed in case of error} messageError
     */
    parseTransfMatrix(node, out, messageError) {
        // Translation
        if (node.nodeName == "translation") {
            // x
            var x = this.reader.getFloat(node, 'x');

            if (x == null || isNaN(x))
                return "unable to parse X component of the translation matrix of the " + messageError;

            // y
            var y = this.reader.getFloat(node, 'y');

            if (y == null || isNaN(y))
                return "unable to parse Y component of the translation matrix of the " + messageError;

            // z
            var z = this.reader.getFloat(node, 'z');

            if (z == null || isNaN(z))
                return "unable to parse Z component of the translation matrix of the " + messageError;

            mat4.translate(out, out, [x, y, z]);
        } 
        
        // Rotation
        else if (node.nodeName == "rotation") {
            // Angle
            var angle = this.reader.getFloat(node, 'angle');

            // Axis
            var axis = this.reader.getString(node, 'axis');

            if (axis == null)
                return "unable to parse axis component of the rotation matrix of the " + messageError;

            var x = (axis == "x") ? 1 : 0;
            var y = (axis == "y") ? 1 : 0;
            var z = (axis == "z") ? 1 : 0;

            mat4.rotate(out, out, angle * DEGREE_TO_RAD, [x, y, z]);
        }
        
        // Scaling
        else if (node.nodeName == "scale") {
            // Scale x
            var sx = this.reader.getFloat(node, 'sx');
            if (sx == null || isNaN(sx))
                return "unable to parse X component of the scale matrix of the " + messageError;

            // Scale y
            var sy = this.reader.getFloat(node, 'sy');

            if (sy == null || isNaN(sy))
                return "unable to parse Y component of the scale matrix of the " + messageError;

            // Scale z
            var sz = this.reader.getFloat(node, 'sz');

            if (sz == null || isNaN(sz))
                return "unable to parse Z component of the scale matrix of the " + messageError;

            mat4.scale(out, out, [sx, sy, sz]);

        }
        
        else {
            return "unable to identify type of transformation matrix of the " + messageError;
        }

        return out;
    }

    parseCamera(node, messageError) {
        var out;

        var type = node.nodeName;

        if (type == "perspective") {
            var near = this.reader.getFloat(node, 'near');
            var far = this.reader.getFloat(node, 'far');
            var angle = this.reader.getFloat(node, 'angle');
        
            var nodeNames = [];
            var children = node.children;
            
            for (let i = 0; i < children.length; i++)
                nodeNames.push(children[i].nodeName);

            var fromIndex = nodeNames.indexOf("from");
            var toIndex = nodeNames.indexOf("to");
            
            if (fromIndex == -1) {
                return "unable to parse position from the camera of " + messageError;
            }

            if (toIndex == -1) {
                return "unable to parse target for the camera of " + messageError;
            }

            var from = this.parseCoordinates3D(children[fromIndex], " camera of " + messageError);
            
            if (typeof from == "string")
                return from;
            
            var to = this.parseCoordinates3D(children[fromIndex], " camera of " + messageError);
            if (typeof to == "string")
                return to;

            return new CGFcamera(angle || 0, near || 0, far || 0, from, to);

        } else if (type == "ortho") {
            var near = this.reader.getFloat(node, 'near');
            var far = this.reader.getFloat(node, 'far');
            var left = this.reader.getFloat(node, 'left');
            var right = this.reader.getFloat(node, 'right');
            var top = this.reader.getFloat(node, 'top');
            var bottom = this.reader.getFloat(node, 'bottom');
        
            var nodeNames = [];
            var children = node.children;
            
            for (let i = 0; i < children.length; i++)
                nodeNames.push(children[i].nodeName);

            var fromIndex = nodeNames.indexOf("from");
            var toIndex = nodeNames.indexOf("to");
            var upIndex = nodeNames.indexOf("up");
            
            if (fromIndex == -1) {
                return "unable to parse position from the camera of " + messageError;
            }

            if (toIndex == -1) {
                return "unable to parse target for the camera of " + messageError;
            }

            var from = this.parseCoordinates3D(children[fromIndex], " camera of " + messageError);
            
            if (typeof from == "string")
                return from;
            
            var to = this.parseCoordinates3D(children[fromIndex], " camera of " + messageError);
            if (typeof to == "string")
                return to;

            var up = [0, 1, 0];

            if (upIndex != -1) {
                up = this.parseCoordinates3D(children[upIndex], "camera of " + messageError);
                if (typeof up == "string")
                    return up;
            }

            return new CGFcameraOrtho(left || 0, right || 0, bottom || 0, top || 0, near || 0, far || 0, from, to, up);

        } else {
            return "unable to identify camera of " + messageError; 
        }
    }

    parsePrimitive(node, messageError) {
        var out;

        var type = this.reader.getString(node, 'type');

        // Rectangle
        if (type == "rectangle") {
            // x1
            var x1 = this.reader.getFloat(node, 'x1');
            if (x1 == null || isNaN(x1))
                return "unable to parse X1 component from the rectangle of the " + messageError;

            // y1
            var y1 = this.reader.getFloat(node, 'y1');
            if (y1 == null || isNaN(y1))
                return "unable to parse Y1 component from the rectangle of the " + messageError;

            // x2
            var x2 = this.reader.getFloat(node, 'x2');
            if (x2 == null || isNaN(x2))
                return "unable to parse X2 component from the rectangle of the " + messageError;

            // y2
            var y2 = this.reader.getFloat(node, 'y2');
            if (y2 == null || isNaN(y2))
                return "unable to parse Y2 component from the rectangle of the " + messageError;

            out = new MyRectangle(this.scene, x1, y1, x2, y2);
        
        } 
        
        // Triangle
        else if (type == "triangle") {
            // x1
            var x1 = this.reader.getFloat(node, 'x1');

            if (x1 == null || isNaN(x1))
                return "unable to parse X1 component from the triangle of the " + messageError;

            // y1
            var y1 = this.reader.getFloat(node, 'y1');

            if (y1 == null || isNaN(y1))
                return "unable to parse Y1 component from the triangle of the " + messageError;

            // x2
            var x2 = this.reader.getFloat(node, 'x2');

            if (x2 == null || isNaN(x2))
                return "unable to parse X2 component from the triangle of the " + messageError;

            // y2
            var y2 = this.reader.getFloat(node, 'y2');

            if (y2 == null || isNaN(y2))
                return "unable to parse Y2 component from the triangle of the " + messageError;

            // x3
            var x3 = this.reader.getFloat(node, 'x3');

            if (x3 == null || isNaN(x3))
                return "unable to parse X3 component from the triangle of the " + messageError;

            // y3
            var y3 = this.reader.getFloat(node, 'y3');

            if (y3 == null || isNaN(y3))
                return "unable to parse Y3 component from the triangle of the " + messageError;

            out = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3);
        } 

        // Sphere
        else if (type == "sphere") {
            let radius = this.reader.getFloat(node, "radius");
            if (radius == null || isNaN(radius))
                return "unable to parse radius component from the sphere of the " + messageError;

            let slices = this.reader.getFloat(node, "slices");
            if (slices == null || isNaN(slices))
                return "unable to parse slices component from the sphere of the " + messageError;
            
            let stacks = this.reader.getFloat(node, "stacks");
            if (stacks == null || isNaN(stacks))
                return "unable to parse stacks component from the sphere of the " + messageError;

            out = new MySphere(this.scene, radius, slices, stacks);
        }

        // Cylinder
        else if (type == "cylinder") {
            let bottomRadius = this.reader.getFloat(node, "bottomRadius");
            if (bottomRadius == null || isNaN(bottomRadius))
                return "unable to parse bottomRadius component from the cylinder of the " + messageError;

            let topRadius = this.reader.getFloat(node, "topRadius");
            if (topRadius == null || isNaN(topRadius))
                return "unable to parse topRadius component from the cylinder of the " + messageError;

            let height = this.reader.getFloat(node, "height");
            if (height == null || isNaN(height))
                return "unable to parse height component from the cylinder of the " + messageError;

            let slices = this.reader.getFloat(node, "slices");
            if (slices == null || isNaN(slices))
                return "unable to parse slices component from the cylinder of the " + messageError;

            let stacks = this.reader.getFloat(node, "stacks");
            if (stacks == null || isNaN(stacks))
                return "unable to parse stacks component from the cylinder of the " + messageError;


            out = new MyCylinder(this.scene, bottomRadius, topRadius, height, slices, stacks);
        }
        
        else 
            return "unable to process primitive of the " + messageError;

        return out;
    }

    /**
     * Displays the scene, processing each node, starting in the root node.
     */
    displayScene() {
        if (this.nodes[this.idRoot] != null) {
            console.log(this.nodes[this.idRoot]);

            this.nodes[this.idRoot].display();
        }
    }
}


