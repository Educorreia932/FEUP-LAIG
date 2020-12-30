class MyGameMenuOption extends CGFobject {
    constructor(scene, values) {
        super(scene);

        this.scene = scene;
        this.values = values;
        this.currentValue = this.values[0];
        this.body = new MySpriteText(this.scene);
    }

    display() {
        this.body.display();
    }
}