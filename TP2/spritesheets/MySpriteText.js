/**
 * MySpriteText
 * @constructor
 */
class MySpriteText {
    constructor(scene, text) {
        this.scene = scene;
        this.text = text;
        this.characters = [];

        this.spritesheet = new MySpriteSheet(scene, "textures/Berlinfont.png", 16, 16);

        this.rectangle = new MyRectangle();
    }

    getCharacterPosition(character) {
        return character.charCodeAt(0);
    }

    display() {
        this.spritesheet.appearance.apply();
        this.spritesheet.appearance.apply();

        this.scene.setActiveShader(this.spritesheet.shader);

        for (let i = 0; i < this.text.length; i++) {
            let character = text.charAt(i);
            let characterCode = getCharacterPosition(character);

            this.spritesheet.activacteCellP(characterCode);

            this.rectangle.display();
        }

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}