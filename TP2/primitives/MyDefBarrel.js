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
        let alpha = Math.PI / 6;

        let controlPoints = [
            // U = 0
            [
                [-this.r, 0, 0, 1],     // V = 0
                [-this.r, h, 0, 1],     // V = 0.5
                [this.r, h, 0, 1],      // V = 0.75
                [this.r, 0, 0, 1]       // V = 1
            ],

            // U = 0.25
            [
                [this.r, 0, 0, 1],                                          // V = 0
                [this.r + H, 0, H / Math.tan(alpha), 1],                    // V = 0.25
                [this.r + H, 0, this.height - H / Math.tan(alpha), 1],      // V = 0.75
                [this.r, 0, this.height, 1]
            ],

            // U = 0.75
            [
                [-this.r + H, 0, this.height -  H / Math.tan(alpha), 1] ,  // V = 0
                [0, this.r + H, this.height -  H / Math.tan(alpha), 1] ,   // V = 0.5
                [this.r + H, 0, this.height - H / Math.tan(alpha), 1]    // V = 1
            ],


            // U = 1
            [
                [-this.r, 0, this.height, 1],     // V = 0
                [-this.r, h, this.height, 1],     // V = 0.5
                [this.r, h, this.height, 1],      // V = 0.75
                [this.r, 0, this.height, 1]       // V = 1
            ]
        ];

        let surface = new CGFnurbsSurface(3, 2, controlPoints);

        this.object = new CGFnurbsObject(this.scene, this.slices, this.stacks, surface);
    }

    display() {
        this.object.display();

        this.scene.rotate(Math.PI, 0, 0, 1);

        this.object.display();
    }
}