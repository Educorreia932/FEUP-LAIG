class MyDefBarrel extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.scene = scene;
        this.r = base;
        this.R = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        let h = (4 / 3) * this.r;
        let H = (4 / 3) * (this.R - this.r);
        let L = this.height;
        let alpha = Math.PI / 6;
        const tanAlpha = Math.tan(alpha);

        let controlPoints = [
            // U = 0
            [
                [-this.r, 0, 0, 1],     // V = 0
                [-this.r, h, 0, 1],     // V = 0.33
                [this.r, h, 0, 1],      // V = 0.66
                [this.r, 0, 0, 1]       // V = 1
            ],

            // U = 0.33
            [
                [-this.r - H, 0, H / tanAlpha, 1],                    // V = 0
                [-this.r - H, h + (4 / 3) * H, H / tanAlpha, 1],      // V = 0.33
                [this.r + H, h + (4 / 3) * H, H / tanAlpha, 1],       // V = 0.66
                [this.r + H, 0, H / tanAlpha, 1]                      // V = 1
            ],

            // U = 0.66
            [
                [-this.r - H, 0, L - H / tanAlpha, 1],                    // V = 0
                [-this.r - H, h + (4 / 3) * H, L - H / tanAlpha, 1],      // V = 0.33
                [this.r + H, h + (4 / 3) * H, L - H / tanAlpha, 1],       // V = 0.66
                [this.r + H, 0, L - H / tanAlpha, 1]                      // V = 1
            ],

            // U = 1
            [
                [-this.r, 0, L, 1],     // V = 0
                [-this.r, h, L, 1],     // V = 0.33
                [this.r, h, L, 1],      // V = 0.66
                [this.r, 0, L, 1]       // V = 1
            ]
        ];

        let surface = new CGFnurbsSurface(3, 3, controlPoints);

        this.object = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface);
    }

    display() {
        this.object.display();

        this.scene.rotate(Math.PI, 0, 0, 1);

        this.object.display();
    }
}