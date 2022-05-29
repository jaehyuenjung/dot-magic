class Pixel {
    constructor(x, y, index, from_color, to_color, duration = 0) {
        this.x = x;
        this.y = y;
        this.index = index;
        this.color = from_color;
        this.from_color = from_color;
        this.to_color = to_color;
        this.duration = duration;
        this.animate = new Animate();
    }

    init(from_color, to_color, duration = 0) {
        this.color = from_color;
        this.from_color = from_color;
        this.to_color = to_color;
        this.duration = duration;
        this.animate.init();
    }

    active(start) {
        this.animate.update(start, this.duration);
    }

    update(deltaT) {
        if (
            this.animate.isAnimate(deltaT) &&
            this.color.levels !== this.to_color.levels
        ) {
            const t = this.animate.calcT(deltaT);
            for (let i = 0; i < 4; i++) {
                this.color.levels[i] =
                    (1 - t) * this.from_color.levels[i] +
                    t * this.to_color.levels[i];
            }
        }
    }
}
