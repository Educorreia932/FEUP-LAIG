/**
 * MySpriteSheet
 * @constructor
 */
class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.texture = new CGFtexture(this.scene, texture);

        this.appearance = new CGFappearance(scene);
        this.appearance.setTexture(texture);

        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(scene.gl, "shaders/spritesheet.vert", "shaders/spritesheet.frag");
        this.shader.setUniformValues({size_c: 1 / sizeM, size_l: 1 / sizeN});
    }

    activacteCellMN(m, n) {
        this.shader.setUniformValues({charCoords: (m, n)});
    }

    activacteCellP(p) {
        let m = p % this.sizeM;
        let n = Math.floor(p / this.sizeM);

        this.activacteCellMN(m, n);
    }
}