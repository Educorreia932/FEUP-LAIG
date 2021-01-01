class MyGameScoreBoard extends CGFobject {
    constructor(orchestrator) {
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;

        this.whiteScore = new MySpriteText(this.scene, "0");
        this.blackScore = new MySpriteText(this.scene, "0");
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(0, 10, 5);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);

        // White score

        this.scene.pushMatrix();

        this.scene.translate(3, 0, 0);

        this.whiteScore.display();

        this.scene.popMatrix();

        // Black score

        this.scene.pushMatrix();

        this.scene.translate(-3, 0, 0)

        this.blackScore.display();

        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    update(time) {
        this.whiteScore.setText(this.orchestrator.scores["w"]);
        this.blackScore.setText(this.orchestrator.scores["b"]);
    }
}