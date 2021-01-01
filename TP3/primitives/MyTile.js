class MyTile extends CGFobject {
    constructor(gameboard) {
        super(gameboard.scene);
        this.gameboard = gameboard;
        this.scene = gameboard.scene;
        this.highlighted = false;

        this.highlightedMaterial = new CGFappearance(this.scene);
        this.highlightedMaterial.setAmbient(0.2, 1.0, 0.2, 1.0);
        this.highlightedMaterial.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.highlightedMaterial.setDiffuse(0.7, 1.0, 0.7, 1.0);
        this.highlightedMaterial.setShininess(0.7, 0.7, 0.7, 1.0);
    }

    display() {
        this.scene.pushMatrix();

        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Place tile on XZ plane

        if (this.highlighted)
            this.body.material = this.highlightedMaterial;

        else 
            this.body.material = this.originalMaterial;

        this.body.display();
        
        this.scene.popMatrix();
    }

    setTheme(body) {
        this.body = body;
        this.originalMaterial = this.body.material;
    }

    setHighlighted(hightlighted) {
        this.highlighted = hightlighted;
    }
}