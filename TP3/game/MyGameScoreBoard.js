class MyGameScoreBoard extends CGFobject {
    constructor(orchestrator) {
        super(orchestrator.scene);
        this.scene = orchestrator.scene;

        this.body = new MySphere(this.scene, 10, 10, 10);
    }

    display() {
        this.scene.pushMatrix();

        this.scene.scale(10, 10, 10);
        this.body.display();

        this.scene.popMatrix();
    }

    update(time) {

    }
}