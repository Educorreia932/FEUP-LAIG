class MyGameMove {
    constructor(originStackIndex, movedStackIndex) {
        let originJ = (originStackIndex - 1) % this.rows;
        let originI = Math.floor((originStackIndex - 1) / this.rows);
    }
}