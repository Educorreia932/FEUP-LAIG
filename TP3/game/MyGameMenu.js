class MyGameMenu extends CGFobject {
    constructor(orchestractor) {
        super(orchestractor.scene);

        this.orchestractor = orchestractor;
        this.scene = this.orchestractor.scene;

        this.options = [
            // Gamemode
            new MyGameMenuOption(
                this.scene,
                [
                    "Player VS Player",
                    "Player VS AI",
                    "AI VS AI"
                ]
            ),

            // Game difficulty
            new MyGameMenuOption(
                this.scene,
                [
                    "Random",
                    "Smart"
                ]
            ),

            // Board dimensions
            new MyGameMenuOption(
                this.scene,
                [
                    "6x6",
                    "6x9",
                    "9x9"
                ]
            ),
        ]
    }

    display() {
        for (let option of this.options) {
            option.display();
            this.scene.translate();
        }
    }
}