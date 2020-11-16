class MySceneMaterials {
    constructor(graph) {
        this.graph = graph;
        this.scene = graph.scene;
    }

    parse(children) {
        let components = [];
        let nodeNames = [];

        let numMaterials = 0;
        let materials = [];

        // Any number of materials.
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName != "material") {
                this.onXMLMinorError("unknown tag <" + children[i].nodeName + ">");
                continue;
            }

            // Get id of the current material.
            let materialID = this.graph.reader.getString(children[i], 'id');

            if (materialID == null)
                return "no ID defined for material";

            // Checks for repeated IDs.
            if (materials[materialID] != null)
                return "ID must be unique for each material (conflict: ID = " + materialID + ")";

            components = children[i].children;

            for (var j = 0; j < components.length; j++)
                nodeNames.push(components[j].nodeName);

            let material = new CGFappearance(this.scene);

            let ambientIndex = nodeNames.indexOf("ambient");
            var diffuseIndex = nodeNames.indexOf("diffuse");
            var specularIndex = nodeNames.indexOf("specular");
            var emissiveIndex = nodeNames.indexOf("emissive");
            var shininessIndex = nodeNames.indexOf("shininess");

            // Ambient component
            if (ambientIndex != -1) {
                let aux = this.graph.parseColor(components[ambientIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setAmbient(...aux);
            }

            else
                return "compenent ambient undefined for material of ID = " + materialID;

            // Diffuse component
            if (diffuseIndex != -1) {
                let aux = this.graph.parseColor(components[diffuseIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setDiffuse(...aux);
            } else {
                return "compenent diffuse undefined for material of ID = " + materialID;
            }

            // Specular component
            if (specularIndex != -1) {
                let aux = this.graph.parseColor(components[specularIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setSpecular(...aux);
            } else {
                return "compenent specular undefined for material of ID = " + materialID;
            }

            // Emissive component
            if (emissiveIndex != -1) {
                let aux = this.graph.parseColor(components[emissiveIndex], "material of ID " + materialID);

                if (typeof aux == "string")
                    return aux;

                material.setEmission(...aux);
            } else {
                return "compenent emissive undefined for material of ID = " + materialID;
            }

            // Shininess component
            if (emissiveIndex != -1) {
                let aux = this.graph.reader.getFloat(components[shininessIndex], 'value');

                if (typeof aux == null || isNaN(aux))
                    return "invalid value for shininess component of material of ID " + materialID;

                material.setShininess(aux);
            }

            else
                return "compenent shininess undefined for material of ID = " + materialID;

            materials[materialID] = material;
            numMaterials++;
        }

        if (numMaterials == 0)
            return "at least one material must be defined";

        return materials;
    }
}