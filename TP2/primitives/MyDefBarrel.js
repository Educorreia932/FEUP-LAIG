class MyPatch extends CGFobject {
    constructor(scene, base, middle, height, slices, stacks) {
        super(scene);

        this.scene = scene;
        this.base = base;
        this.middle = middle;
        this.height = height;
        this.slices = slices;
        this.stacks = stacks;

        this.initBuffers();
    }

    initBuffers() {
        let controlPoints = [
            // U = 0
            [
                [-this.base, 0, 0, 1],  // V = 0
                [0, this.base, 0, 1],   // V = 0.5
                [this.base, 0, 0, 1]    // V = 1
            ],

            // U = 0.5
            [
                [-this.middle, 0, this.height / 2, 1],  // V = 0
                [0, this.middle, this.height / 2, 1],   // V = 0.5
                [this.middle, 0, this.height / 2, 1]    // V = 1
            ]

            // U = 1
            [
                [-this.base, 0, this.height, 1],  // V = 0
                [0, this.base, this.height, 1],   // V = 0.5
                [this.base, 0, this.height, 1]    // V = 1
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