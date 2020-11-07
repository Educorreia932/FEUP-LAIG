/**
 * MySpriteText
 * @constructor
 */
class MySpriteText extends CGFobject {
    constructor(scene, text) {
        super(scene);
        this.text = text;

        this.spritesheet = new MySpriteSheet(scene, "textures/oolite-font.png", 16, 16);

        this.rectangle = new MyRectangle(scene, 0, 0, 1, 1);
    }

    getCharacterPosition(character) {
        return character.charCodeAt(0);
    }

    display() {
        this.scene.pushTexture(this.spritesheet.texture);

        this.scene.setActiveShader(this.spritesheet.shader);

        for (let i = 0; i < this.text.length; i++) {
            let character = this.text.charAt(i);
            let characterCode = this.getCharacterPosition(character);

            this.spritesheet.shader.setUniformsValues({char_index: i});
            this.spritesheet.activacteCellP(characterCode);

            this.rectangle.display();
        }

        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popTexture(this.spritesheet.texture);
    }
}