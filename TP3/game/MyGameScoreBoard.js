class MyGameScoreBoard extends CGFobject {
    constructor(orchestrator) {
        super(orchestrator.scene);
        this.orchestrator = orchestrator;
        this.scene = orchestrator.scene;

        // this.background = new Rectangle(this.scene, )
        this.whiteScore = new MySpriteText(this.scene, "White: 0");
        this.blackScore = new MySpriteText(this.scene, "Black: 0");
        this.timeElapsed = new MySpriteText(this.scene, "Time elapsed: 0 seconds");
    }

    display() {
        this.scene.pushMatrix();

        this.scene.translate(0, 10, 5);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);

        // White score

        this.scene.pushMatrix();

        this.scene.translate(1, 0, 0);

        this.whiteScore.display();

        this.scene.popMatrix();

        // Black score

        this.scene.pushMatrix();

        this.scene.translate(-4.5, 0, 0);

        this.blackScore.display();

        this.scene.popMatrix();

        // Time elapsed

        this.scene.pushMatrix();

        this.scene.translate(-this.timeElapsed.getLength() / 4, -3, 0);

        this.timeElapsed.display();

        this.scene.popMatrix();

        this.scene.popMatrix();
    }

    update() {
        this.whiteScore.setText("White: " + this.orchestrator.scores["w"]);
        this.blackScore.setText("Black: " + this.orchestrator.scores["b"]);
        this.timeElapsed.setText("Time elapsed: " + this.orchestrator.elapsedTime + " seconds");
    }
}