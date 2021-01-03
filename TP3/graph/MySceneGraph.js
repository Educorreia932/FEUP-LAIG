const DEGREE_TO_RAD = Math.PI / 180;

// Order of the groups in the XML document.
var INITIALS_INDEX = 0;
var VIEWS_INDEX = 1;
var ILLUMINATION_INDEX = 2;
var LIGHTS_INDEX = 3;
var TEXTURES_INDEX = 4;
var SPRITESHEETS_INDEX = 5;
var MATERIALS_INDEX = 6;
var ANIMATIONS_INDEX = 7;
var NODES_INDEX = 8;

// Order of the transformations in keyframe block.
var KEYFRAME_TRANSLATION_INDEX = 0;
var KEYFRAME_ROTATIONX_INDEX = 1;
var KEYFRAME_ROTATIONY_INDEX = 2;
var KEYFRAME_ROTATIONZ_INDEX = 3;
var KEYFRAME_SCALE_INDEX = 4;

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

        // Structure to store the cameras defined
        this.cameras = [];

        this.defaultCamera = null; // The id of the default camera.

        // Graph containing the nodes of the scene
        this.nodes = [];
        this.board = null;

        // Structures to store the materials, textures and animations defined in the scene
        this.textures = [];
        this.materials = [];
        this.animations = [];

        this.idRoot = null; // The id of the root element of the graph.

        this.axisCoords = [];
        this.axisCoords['x'] = [1, 0, 0];
        this.axisCoords['y'] = [0, 1, 0];
        this.axisCoords['z'] = [0, 0, 1];

        // File reading 
        this.reader = new CGFXMLreader();

        this.xml_file = filename;
        /*
         * Read the contents of the xml file, and refer to this class for loading and error handlers.
         * After the file is read, the reader calls onXMLReady on this object.
         * If any error occurs, the reader calls onXMLError on this object, with an error message
         */
        this.reader.open('scenes/' + filename, this);


        this.errorTexture = new CGFtexture(this.scene, "./scenes/required_textures/error_texture.png");
        this.errorMaterial = new CGFappearance(this.scene);
        this.errorMaterial.setAmbient(1, 1, 1, 1);
        this.errorMaterial.setDiffuse(0, 0, 0, 1);
        this.errorMaterial.setEmission(1, 1, 1, 1);
        this.errorMaterial.setSpecular(0, 0, 0, 1);
        this.errorMaterial.setShininess(10.0);

        scene.enableTextures(true);
    }

    reinit(filename) {
        this.cameras = [];

        this.defaultCamera = null;

        this.nodes = [];
        this.board = null;

        this.textures = [];
        this.materials = [];
        this.animations = [];

        this.idRoot = null;

        this.xml_file = filename;
        this.reader.open('scenes/' + filename, this);
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

        var nonAnimationsBlock = true; // indicates if block <animations> exists

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

            // sParse textures block
            if ((error = this.parseTextures(nodes[index])) != null)
                return error;
        }

        // <spritesheets>
        if ((index = nodeNames.indexOf("spritesheets")) == -1)
            return "tag <spritesheets> missing";

        else {
            if (index != SPRITESHEETS_INDEX)
                this.onXMLMinorError("tag <spritesheets> out of order");

            //Parse textures block
            if ((error = this.parseSpritesheets(nodes[index])) != null)
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

        if ((index = nodeNames.indexOf("animations")) != -1) {
            nonAnimationsBlock = false;

            if (index != ANIMATIONS_INDEX)
                this.onXMLMinorError("tag <animations> out of order");

            // Parse animations block
            if ((error = this.parseAnimations(nodes[index])) != null)
                return error;
        }

        // <nodes>
        if ((index = nodeNames.indexOf("nodes")) == -1)
            return "tag <nodes> missing";

        else {
            if (index != NODES_INDEX - nonAnimationsBlock)
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
        if (rootIndex == -1)
            return "No root id defined for scene.";

        var rootNode = children[rootIndex];
        var id = this.reader.getString(rootNode, 'id');

        if (id == null)
            return "No root id defined for scene.";

        this.idRoot = id;

        // Get axis length        
        if (referenceIndex == -1)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        var refNode = children[referenceIndex];
        var axis_length = this.reader.getFloat(refNode, 'length');

        if (axis_length == null)
            this.onXMLMinorError("no axis_length defined for scene; assuming 'length = 1'");

        this.referenceLength = (axis_length != null) ? axis_length : 1;

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
            return "At least one camera must be defined";

        if (this.cameras[defaultCam] == null)
            return "No default camera found";

        this.defaultCamera = defaultCam;

        this.log("Parsed views");

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
                attributeTypes.push(...["boolean", "position", "color", "color", "color"]);
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
        let children = texturesNode.children;

        this.textures = new MySceneTextures(this).parse(children);

        if (typeof this.textures === "string") // An error occurred while parsing
            return this.textures;

        this.log("Parsed textures");

        return null;
    }

    /**
     * Parses the <spritesheets> node.
     * @param {spritesheets block element} spritesheetsNode
     */
    parseSpritesheets(spritesheetsNode) {
        var children = spritesheetsNode.children;

        this.spritesheets = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "spritesheet") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            let spritesheetID = this.reader.getString(children[i], 'id');

            if (spritesheetID == null) {
                return "no ID defined for spritesheet";
            }

            if (this.spritesheets[spritesheetID] != null) {
                return "ID must be unique for each spritesheet (conflict: ID = " + spritesheetID + ")";
            }

            let spritesheetPath = this.reader.getString(children[i], 'path');

            if (spritesheetPath == null) {
                return "no path defined for spritesheet";
            }

            let sizeM = this.reader.getInteger(children[i], 'sizeM');

            if (sizeM == null || isNaN(sizeM)) {
                return "no horizontal size defined for spritesheet";
            }

            let sizeN = this.reader.getInteger(children[i], 'sizeN');

            if (sizeN == null || isNaN(sizeN)) {
                return "no vertical size defined for spritesheet";
            }

            var spritesheet = new MySpriteSheet(this.scene, spritesheetPath, sizeM, sizeN);

            this.spritesheets[spritesheetID] = spritesheet;
        }

        this.log("Parsed spritesheets");

        return null;
    }

    /**
     * Parses the <materials> node.
     * @param {materials block element} materialsNode
     */
    parseMaterials(materialsNode) {
        let children = materialsNode.children;

        this.materials = new MySceneMaterials(this).parse(children);

        if (typeof this.materials === "string") // An error occurred while parsing
            return this.materials;

        this.log("Parsed materials");

        return null;
    }

    /**
     * Parses the <animations> block
     * @param {animations block element} animationsNode 
     */
    parseAnimations(animationsNode) {
        var children = animationsNode.children;

        this.animations = [];

        var grandChildren = [];

        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "animation") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            var animationID = this.reader.getString(children[i], 'id');

            if (animationID == null) {
                this.onXMLMinorError("no ID defined for animation number #" + i);
                continue;
            }

            if (this.animations[animationID] != null) {
                this.onXMLMinorError("ID must be unique for each animation (conflict ID = " + animationID + ")");
                continue;
            }

            grandChildren = children[i].children;

            let last_keyframe_instant = -1;
            let keyframes = [];

            for (var j = 0; j < grandChildren.length; j++) {
                if (grandChildren[j].nodeName != "keyframe") {
                    this.onXMLMinorError("unknown tag <" + grandChildren[i].nodeName + ">");
                    continue;
                }

                let keyframe = this.parseKeyframe(grandChildren[j], last_keyframe_instant, " of animation " + animationID);

                if (keyframe == null) continue;

                last_keyframe_instant = keyframe["instant"];

                keyframes.push(keyframe);
            }

            if (keyframes.length <= 0) {
                this.onXMLMinorError("animation " + animationID + " must have at least one keyframe")
                continue;
            }

            keyframes.sort((keyframeA, keyframeB) => keyframeA["instant"] - keyframeB["instant"]);

            // Eliminate keyframes on the same instant
            for (let a_i = 1; a_i < keyframes.length;) {
                if (keyframes[a_i - 1]["instant"] == keyframes[a_i]["instant"]) {
                    this.onXMLMinorError("invalid keyframes - multiple keyframes for instant " + keyframes[a_i]["instant"]);
                    keyframes.splice(a_i, 1);
                } else
                    a_i++;
            }

            let animation = new MyKeyframeAnimation(this.scene, keyframes);

            this.animations[animationID] = animation;
        }

        return null;
    }

    parseKeyframe(keyframeNode, last_keyframe_instant, messageError) {
        let keyframe_instant = this.reader.getFloat(keyframeNode, 'instant');

        if (keyframe_instant == null || isNaN(keyframe_instant) || keyframe_instant < 0) {
            this.onXMLMinorError("no instant defined or invalid instant for the keyframe " + messageError);
            return null;
        }

        if (keyframe_instant <= last_keyframe_instant)
            this.onXMLMinorError("keyframes should be in ascending order of instant; last-keyframe=" + last_keyframe_instant + ", current-keyframe=" + keyframe_instant + ", " + messageError);


        var transformationsNodes = keyframeNode.children;

        let keyframe = [];

        keyframe["instant"] = keyframe_instant;

        keyframe["rotation"] = [0, 0, 0];

        for (let i = 0; i < transformationsNodes.length; i++) {

            let nodeName = transformationsNodes[i].nodeName;

            // Translation
            if (nodeName == 'translation') {
                if (i != KEYFRAME_TRANSLATION_INDEX)
                    this.onXMLMinorError("block <translation> is out of order for the keyframe in instant=" + keyframe_instant + " of the " + messageError);

                // x
                var x = this.reader.getFloat(transformationsNodes[i], 'x');

                if (x == null || isNaN(x)) {
                    this.onXMLMinorError("unable to parse X component of the translation matrix of the " + messageError);
                    x = 0;
                }

                // y
                var y = this.reader.getFloat(transformationsNodes[i], 'y');

                if (y == null || isNaN(y)) {
                    this.onXMLMinorError("unable to parse Y component of the translation matrix of the " + messageError);
                    y = 0;
                }

                // z
                var z = this.reader.getFloat(transformationsNodes[i], 'z');

                if (z == null || isNaN(z)) {
                    this.onXMLMinorError("unable to parse Z component of the translation matrix of the " + messageError);
                    z = 0;
                }

                keyframe["translation"] = [x, y, z];

            }

            else if (nodeName == 'rotation') { // Rotation
                // Axis
                var axis = this.reader.getString(transformationsNodes[i], 'axis');

                if (axis == null) {
                    this.onXMLMinorError("unable to parse axis component of the rotation matrix of the " + messageError);
                    continue;
                }

                if (axis != 'x' && axis != 'y' && axis != 'z') {
                    this.onXMLMinorError("invalid axis value (" + messageError);
                    continue;
                }

                // Angle
                var angle = this.reader.getFloat(transformationsNodes[i], 'angle');

                if (angle == null || isNaN(angle)) {
                    this.onXMLMinorError("unable to parse angle component of the rotation matrix of the " + messageError);
                    angle = 0;
                }

                let index = (axis == 'x' ? 0 : (axis == 'y' ? 1 : 2));
                let order = (axis == 'x' ? KEYFRAME_ROTATIONX_INDEX : (axis == 'y' ? KEYFRAME_ROTATIONY_INDEX : KEYFRAME_ROTATIONZ_INDEX));

                if (order != i)
                    this.onXMLMinorError("block <rotation> is out of order for axis " + axis + " of the " + messageError);

                keyframe["rotation"][index] = angle * DEGREE_TO_RAD;

            } else if (nodeName == "scale") { // Scaling
                if (i != KEYFRAME_SCALE_INDEX)
                    this.onXMLMinorError("block <scale> is out of order for the keyframe in instant=" + keyframe_instant + " of the " + messageError);

                // Scale x
                var sx = this.reader.getFloat(transformationsNodes[i], 'sx');
                if (sx == null || isNaN(sx)) {
                    this.onXMLMinorError("unable to parse X component of the scale matrix of the " + messageError);
                    sx = 0;
                }

                // Scale y
                var sy = this.reader.getFloat(transformationsNodes[i], 'sy');

                if (sy == null || isNaN(sy)) {
                    this.onXMLMinorError("unable to parse Y component of the scale matrix of the " + messageError);
                    sy = 0;
                }

                // Scale z
                var sz = this.reader.getFloat(transformationsNodes[i], 'sz');

                if (sz == null || isNaN(sz)) {
                    this.onXMLMinorError("unable to parse Z component of the scale matrix of the " + messageError);
                    sz = 0;
                }

                keyframe["scale"] = [sx, sy, sz];

            } else {
                this.onXMLMinorError("unkown transformation of name (name=" + nodeName + ") " + messageError);
            }
        }

        return keyframe;
    }

    updateAnimations(time) {
        for (const [animationID, animation] of Object.entries(this.animations))
            animation.update(time);

        for (const [nodeID, node] of Object.entries(this.nodes))
            node.update(time);
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
            var animationIndex = nodeNames.indexOf("animationref");
            var materialIndex = nodeNames.indexOf("material");
            var textureIndex = nodeNames.indexOf("texture");
            var descendantsIndex = nodeNames.indexOf("descendants");

            // Transformations
            var transfMatrix = mat4.create();

            if (transformationsIndex != -1) {
                let transformations = grandChildren[transformationsIndex].children;
                let transformationMatrixParser = new MySceneTransformationMatrix(this, "node of ID " + nodeID);

                // Iterate over transformations
                for (let t = 0; t < transformations.length; t++) {
                    var aux = transformationMatrixParser.parse(transformations[t], transfMatrix);

                    if (typeof aux === 'string') { // An error occurred
                        this.onXMLMinorError(aux);
                        continue;
                    }

                    transfMatrix = aux;
                }
            }

            node.transformation = transfMatrix;

            this.log("Parsed transformations");

            // Animation
            var animation = null;

            if (animationIndex != -1) {
                animation = this.reader.getString(grandChildren[animationIndex], 'id');

                if (animation == null) {
                    this.onXMLMinorError("no valid animation found for node " + nodeID);
                }
            }

            node.animation = animation;

            // Material
            var material;

            if (materialIndex != -1) {
                material = this.reader.getString(grandChildren[materialIndex], 'id');

                if (material == null) {
                    this.onXMLMinorError("no valid material found for node " + nodeID);
                    material = this.errorMaterial;
                }
            } else {
                this.onXMLMinorError("undefined material found for node " + nodeID);
                material = this.errorMaterial;
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

                let auxS = null;
                let auxT = null;

                if (grandgrandChildren.length < 1 || grandgrandChildren[0].nodeName != "amplification") {
                    this.onXMLMinorError("unable to parse texture amplification for texture " + texture.id + " for node " + nodeID + "; assuming amplication of 1.0");
                    auxS = 1.0;
                    auxT = 1.0;
                } else {
                    auxS = this.reader.getFloat(grandgrandChildren[0], 'afs');
                    auxT = this.reader.getFloat(grandgrandChildren[0], 'aft');

                    if (auxS == null || isNaN(auxS)) {
                        this.onXMLMinorError("unable to parse afs component from the texture of ID " + texture.id + " of the node " + nodeID);
                        auxS = 1.0;
                    }

                    if (auxT == null || isNaN(auxT)) {
                        this.onXMLMinorError("unable to parse aft component from the texture of ID " + texture.id + " of the node " + nodeID);
                        auxT = 1.0;
                    }
                }

                texture.afs = auxS;
                texture.aft = auxT;

                node.texture = texture;
            } else {
                this.onXMLMinorError("texture undefined for node of ID " + nodeID);
                node.texture = this.errorTexture;
            }

            // Descendants
            if (descendantsIndex != -1) {
                grandgrandChildren = grandChildren[descendantsIndex].children;

                for (let i = 0; i < grandgrandChildren.length; i++) {
                    if (grandgrandChildren[i].nodeName == "noderef") {
                        var aux = this.reader.getString(grandgrandChildren[i], 'id');
                        if (aux == null) {
                            this.onXMLMinorError("invalid descendant for node " + nodeID);
                            continue;
                        }

                        node.addDescendant(aux);

                    }

                    else if (grandgrandChildren[i].nodeName == "leaf") {
                        var aux = this.parsePrimitive(grandgrandChildren[i], texture.afs, texture.aft, "node of ID " + nodeID);

                        if (typeof aux == "string") {
                            this.onXMLMinorError("invalid primitive for node " + nodeID + ":\n\t" + aux);
                            continue;
                        } else if (aux === true) {
                            continue;
                        }

                        node.addObject(aux);
                    }
                }
            }

            if (node.id != "gameBoard" && node.id != "gameMenu" && node.descendants.length < 1) {
                this.onXMLMinorError("node of ID " + nodeID + " must have atleast one descendant");
                continue;
            }

            this.nodes[nodeID] = node;
        }

        // Initialize nodes by replacing all references to real values
        if (this.nodes[this.idRoot] == null)
            return "scene doesn't have a valid root node";

        this.nodes[this.idRoot].initialize(this);

        if (this.board != null) {
            this.initThemeBoard();
        }

        this.log("Parsed nodes");

        return null;
    }

    initThemeBoard() {
        for (let i = 0; i < this.board.pieces.length; i++) {
            if (this.nodes[this.board.pieces[i]] != null) {
                this.nodes[this.board.pieces[i]].initialize(this);
            }
        }

        for (let i = 0; i < this.board.tiles.length; i++) {
            if (this.nodes[this.board.tiles[i]] != null) {
                this.nodes[this.board.tiles[i]].initialize(this);
            }
        }
    }

    parseBoolean(node, name, messageError) {
        var boolVal = true;

        boolVal = this.reader.getBoolean(node, name);

        if (!(boolVal != null && !isNaN(boolVal) && (boolVal == true || boolVal == false)))
            this.onXMLMinorError("unable to parse value component " + messageError + "; assuming 'value = 1'");

        return boolVal;
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

    parseCamera(node, messageError) {
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

            var to = this.parseCoordinates3D(children[toIndex], " camera of " + messageError);
            if (typeof to == "string")
                return to;

            return new CGFcamera(angle * DEGREE_TO_RAD || 0, near || 0, far || 0, from, to);

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

            var to = this.parseCoordinates3D(children[toIndex], " camera of " + messageError);
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

    parsePrimitive(node, textureAfs, textureAft, messageError) {
        let out;
        let type = this.reader.getString(node, 'type');

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

            out = new MyRectangle(this.scene, x1, y1, x2, y2, textureAfs, textureAft);

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

            out = new MyTriangle(this.scene, x1, y1, x2, y2, x3, y3, textureAfs, textureAft);
        }


        else if (type == "pyramid") {
            // Slices
            let slices = this.reader.getFloat(node, 'slices');

            if (slices == null || isNaN(slices))
                return "unable to parse slices component from the pyramid of the " + messageError;

            // Stacks
            let stacks = this.reader.getFloat(node, 'stacks');

            if (stacks == null || isNaN(stacks))
                return "unable to parse stacks component from the pyramid of the " + messageError;

            out = new MyPyramid(this.scene, slices, stacks);
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

        // Torus
        else if (type == "torus") {
            let inner = this.reader.getFloat(node, "inner");
            if (inner == null || isNaN(inner))
                return "unable to parse inner component from the torus of the " + messageError;

            let outer = this.reader.getFloat(node, "outer");
            if (outer == null || isNaN(outer))
                return "unable to parse outer component from the torus of the " + messageError;

            let slices = this.reader.getFloat(node, "slices");
            if (slices == null || isNaN(slices))
                return "unable to parse slices component from the torus of the " + messageError;

            let loops = this.reader.getFloat(node, "loops");
            if (loops == null || isNaN(loops))
                return "unable to parse loops component from the torus of the " + messageError;

            out = new MyTorus(this.scene, inner, outer, slices, loops);
        }

        // Sprite Text
        else if (type == "spritetext") {
            let text = this.reader.getString(node, "text");

            if (text == null)
                return "Unable to parse text component from the spritetext of the " + messageError;

            out = new MySpriteText(this.scene, text);
        }

        // Sprite Animation
        else if (type == "spriteanim") {
            let ssid = this.reader.getString(node, "ssid");

            if (ssid == null)
                return "Unable to parse spritesheet ID component from the sprite animation of the " + messageError;

            let duration = this.reader.getFloat(node, "duration");

            if (duration == null || isNaN(duration))
                return "Unable to parse duration component from the sprite animation of the " + messageError;

            let startCell = this.reader.getFloat(node, "startCell");

            if (startCell == null || isNaN(startCell))
                return "Unable to parse start cell component from the sprite animation of the " + messageError;


            let endCell = this.reader.getFloat(node, "endCell");

            if (endCell == null || isNaN(startCell))
                return "Unable to parse end cell component from the sprite animation of the " + messageError;

            out = new MySpriteAnimation(this.scene, ssid, duration, startCell, endCell);
        }

        // Plane
        else if (type == "plane") {
            let uDivisions = this.reader.getInteger(node, "npartsU");

            if (uDivisions == null || isNaN(uDivisions)) {
                this.onXMLMinorError("Unable to parse U divisions from the plane of the " + messageError + "; assuming uDivisions = 1");
                uDivisions = 1;
            }

            if (uDivisions <= 0) {
                this.onXMLMinorError("Invalid value for U divisions from the plane of the " + messageError + "; assuming uDivisions = 1");
                uDivisions = 1;
            }

            let vDivisions = this.reader.getInteger(node, "npartsV");

            if (vDivisions == null || isNaN(vDivisions)) {
                this.onXMLMinorError("Unable to parse V divisions from the plane of the " + messageError + "; assuming vDivisions = 1");
                vDivisions = 1;
            }

            if (vDivisions <= 0) {
                this.onXMLMinorError("Invalid value for V divisions from the plane of the " + messageError + "; assuming vDivisions = 1");
                vDivisions = 1;
            }

            out = new MyPlane(this.scene, uDivisions, vDivisions);
        }

        // Patch
        else if (type == "patch") {
            return this.parsePatchPrimitive(node, messageError);
        }

        // Defbarrel
        else if (type == "defbarrel") {
            let base = this.reader.getFloat(node, "base");

            if (base == null || isNaN(base))
                return "Unable to parse base value from the barrel of the " + messageError;

            let middle = this.reader.getFloat(node, "middle");

            if (middle == null || isNaN(middle))
                return "Unable to parse middle value from the barrel of the " + messageError;

            let height = this.reader.getFloat(node, "height");

            if (height == null || isNaN(height))
                return "Unable to parse height value from the barrel of the " + messageError;

            let slices = this.reader.getFloat(node, "slices");

            if (slices == null || isNaN(slices))
                return "Unable to parse slices value from the barrel of the " + messageError;

            if (slices < 0) return "Invalid value for slices value from the barrel of the " + messageError;

            let stacks = this.reader.getFloat(node, "stacks");

            if (stacks == null || isNaN(stacks))
                return "Unable to parse stacks value from the barrel of the " + messageError;

            if (stacks < 0)
                return "Invalid value for stacks value from the barrel of the " + messageError;

            out = new MyDefBarrel(this.scene, base, middle, height, slices, stacks);
        }

        // Gameboard
        else if (type == "board") {
            this.board = this.parseBoard(node, messageError);
            out = true;
        }

        else
            return "Unable to process primitive of the " + messageError;

        return out;
    }

    parseBoard(node, messageError) {
        let board = {};

        let children = node.children;

        if (children.length == 0) return "Missing parts of the board of the " + messageError;

        let nodeNames = [];

        for (let i = 0; i < children.length; i++) {
            nodeNames.push(children[i].nodeName);
        }

        let piecesIndex = nodeNames.indexOf("pieces");
        let tilesIndex = nodeNames.indexOf("tiles");

        if (piecesIndex == -1) return "Missing pieces specification of the board of the " + messageError 
        if (tilesIndex == -1) return "Missing tiles specification of the board of the " + messageError 

        
        let piecesNode = children[piecesIndex];
        let piecesHeight = this.reader.getString(piecesNode, 'height');
        let piecesOffset = this.reader.getString(piecesNode, 'offset');

        let pieceNodes = piecesNode.children;
        
        let pieces = [];

        for (let i = 0; i < pieceNodes.length; i++) {
            if (pieceNodes[i].nodeName != "piece") continue;

            let id = this.reader.getString(pieceNodes[i], "id");

            if (id == null) continue;

            pieces.push(id);
        }

        if (pieces.length == 0) return "No pieces for board";
        
        board.pieces = pieces;

        board.piecesHeight = piecesHeight;
        board.heightOffsetPercent = piecesOffset;

        let tilesNode = children[tilesIndex];

        let tileNodes = tilesNode.children;
        
        let tiles = [];

        for (let i = 0; i < tileNodes.length; i++) {
            if (tileNodes[i].nodeName != "tile") continue;

            let id = this.reader.getString(tileNodes[i], "id");

            if (id == null) continue;

            tiles.push(id);
        }

        if (tiles.length == 0) return "No tiles for board";

        board.tiles = tiles;

        return board;
    }

    /**
     * Parse a patch primitive
     * @param {block element} node
     * @param {message to be displayed in case of error} messageError
     */
    parsePatchPrimitive(node, messageError) {
        let pointsU = this.reader.getInteger(node, "npointsU");
        if (pointsU == null || isNaN(pointsU))
            return "Unable to parse npointsU value for the patch of the " + messageError;

        if (pointsU <= 0) return "Invalid npointsU value for the patch of the " + messageError;

        let pointsV = this.reader.getInteger(node, "npointsV");
        if (pointsV == null || isNaN(pointsV))
            return "Unable to parse npointsV value for the patch of the " + messageError;

        if (pointsV <= 0) return "Invalid npointsV value for the patch of the " + messageError;

        let uDivisions = this.reader.getInteger(node, "npartsU");
        if (uDivisions == null || isNaN(uDivisions))
            return "Unable to parse npartsU value for the patch of the " + messageError;

        if (uDivisions < 0) return "Invalid npartsU value for the patch of the " + messageError;

        let vDivisions = this.reader.getInteger(node, "npartsV");
        if (vDivisions == null || isNaN(vDivisions))
            return "Unable to parse npartsV value for the patch of the " + messageError;

        if (vDivisions < 0) return "Invalid npartsV value for the patch of the " + messageError;

        let children = node.children;

        if (children.length != pointsU * pointsV) return "Missing control points on patch of the " + messageError + "; Expected " + (pointsU * pointsV) + " got " + children.length;

        let arrayPoints = [];

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeName != "controlpoint")
                return "Unknown tag <" + children[i].nodeName + "> on the control points in patch of the " + messageError;

            let coords = this.parseCoordinates3D(children[i], "in the patch of the " + messageError);

            if (typeof coords == "string") return coords;

            coords.push(1);

            arrayPoints.push(coords);
        }

        let controlPoints = this.arrayToMatrix(arrayPoints, pointsV);
        return new MyPatch(this.scene, pointsU, pointsV, uDivisions, vDivisions, controlPoints);
    }

    arrayToMatrix(array, elementsPerColumn) {
        let matrix = [];
        for (let i = 0; i < array.length; i += elementsPerColumn) {
            matrix.push(array.slice(i, i + elementsPerColumn));
        }
        return matrix;
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
     * Displays the scene, processing each node, starting in the root node.
     */
    display() {
        if (this.nodes[this.idRoot] != null) {
            this.nodes[this.idRoot].display();
        }
    }
}
