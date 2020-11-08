/**
 * MySpriteAnimation
 * @constructor
 */
class MySpriteAnimation extends CGFobject {
    constructor(scene, ssid, duration, startCell, endCell) {
        super(scene);
        
        this.spritesheet = ssid;
        this.startCell = startCell;
        this.endCell = endCell;

        this.currentCell = startCell;
        this.segmentTime = duration / (endCell - startCell)
        this.currentTime = this.segmentTime;

        this.rectangle = new MyRectangle(scene, 0, 0, 1, 1);
    }

    update(time) {
        if (this.currentCell == this.endCell)
            this.currentCell = this.startCell;

        if (time > this.currentTime) {
            this.currentCell += 1;
            this.currentTime += this.segmentTime;
        }
    }

    display() {
        this.scene.pushTexture(this.spritesheet.texture);

        this.scene.setActiveShader(this.spritesheet.shader);

        this.spritesheet.activacteCellP(this.currentCell);

        this.rectangle.display();

        this.scene.setActiveShader(this.scene.defaultShader);

        this.scene.popTexture(this.spritesheet.texture);
    }
}