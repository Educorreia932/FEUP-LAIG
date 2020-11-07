/**
 * MySpriteSheet
 * @constructor
 */
class MySpriteSheet {
    constructor(scene, texture, sizeM, sizeN) {
        this.texture = new CGFtexture(scene, texture);

        this.sizeM = sizeM;
        this.sizeN = sizeN;

        this.shader = new CGFshader(scene.gl, "shaders/spritesheet.vert", "shaders/spritesheet.frag");
    }

    activacteCellMN(m, n) {
        this.shader.setUniformsValues({size_c: 1 / this.sizeM, size_l: 1 / this.sizeN});
        this.shader.setUniformsValues({charCoords: [m, n]});
    }

    activacteCellP(p) {
        let m = p % this.sizeM;
        let n = Math.floor(p / this.sizeM);

        this.activacteCellMN(m, n);
    }
}