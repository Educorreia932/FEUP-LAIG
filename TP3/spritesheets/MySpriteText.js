/**
 * MySpriteText
 * @constructor
 */
class MySpriteText extends CGFobject {
    constructor(scene, text) {
        super(scene);
        this.text = text;

        this.spritesheet = new MySpriteSheet(scene, "textures/Berlinfont.png", 16, 16);

        this.rectangle = new MyRectangle(scene, -0.4, -0.5, 0.4, 0.5);
    }

    getCharacterPosition(character) {
        return character.charCodeAt(0);
    }

    display() {
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(this.scene.gl.SRC_ALPHA, this.scene.gl.ONE_MINUS_SRC_ALPHA);
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
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
    
    setText(text) {
        this.text = text;
    }

    getLength() {
        return this.text.length;
    }
}