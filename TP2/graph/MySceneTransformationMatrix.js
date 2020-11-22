class MySceneTransformationMatrix {
    constructor(graph, messageError) {
        this.graph = graph;
        this.scene = graph.scene;
        this.messageError = messageError;
    }

    /**
     * Parse a transformation matrix of a node
     * @param {block element} node
     * @param {matrix where result is stored} out
     * @param {message to be displayed in case of error} messageError
     */
    parse(node, out) {
        // Translation
        if (node.nodeName == "translation") {
            // x
            var x = this.graph.reader.getFloat(node, 'x');

            if (x == null || isNaN(x))
                return "unable to parse X component of the translation matrix of the " + messageError;

            // y
            var y = this.graph.reader.getFloat(node, 'y');

            if (y == null || isNaN(y))
                return "unable to parse Y component of the translation matrix of the " + messageError;

            // z
            var z = this.graph.reader.getFloat(node, 'z');

            if (z == null || isNaN(z))
                return "unable to parse Z component of the translation matrix of the " + messageError;

            mat4.translate(out, out, [x, y, z]);
        }

        // Rotation
        else if (node.nodeName == "rotation") {
            // Angle
            var angle = this.graph.reader.getFloat(node, 'angle');

            // Axis
            var axis = this.graph.reader.getString(node, 'axis');

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
            var sx = this.graph.reader.getFloat(node, 'sx');
            if (sx == null || isNaN(sx))
                return "unable to parse X component of the scale matrix of the " + messageError;

            // Scale y
            var sy = this.graph.reader.getFloat(node, 'sy');

            if (sy == null || isNaN(sy))
                return "unable to parse Y component of the scale matrix of the " + messageError;

            // Scale z
            var sz = this.graph.reader.getFloat(node, 'sz');

            if (sz == null || isNaN(sz))
                return "unable to parse Z component of the scale matrix of the " + messageError;

            mat4.scale(out, out, [sx, sy, sz]);

        }

        else
            return "unable to identify type of transformation matrix of the " + this.messageError;

        return out;
    }
}