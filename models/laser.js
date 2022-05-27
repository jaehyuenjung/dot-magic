class Laser {
    constructor(x, y, schedule, loadMap) {
        this.x = x;
        this.y = y;
        this.schedule = schedule;
        this.loadMap = loadMap;
    }

    move(x, y) {
        this.x = x;
        this.y = y;
    }

    update(deltaT, index) {
        this.loadMap[this.schedule[index]].forEach((pixel) =>
            pixel.active(deltaT)
        );
    }

    draw(index) {
        const aroundPos = this.loadMap[this.schedule[index]];
        let centerX = 0;
        let centerY = 0;
        let centerColor = Array.from({ length: 4 }, (_) => 0);
        aroundPos.forEach((pixel) => {
            centerX += pixel.x;
            centerY += pixel.y;
            for (let i = 0; i < 4; i++) {
                centerColor[i] += pixel.to_color.levels[i];
            }
        });
        centerX /= aroundPos.length;
        centerY /= aroundPos.length;
        centerColor = centerColor.map((v) => v / aroundPos.length);
        push();
        stroke(color(centerColor));
        line(this.x, this.y, centerX, centerY);
        pop();
    }

    init(x, y, schedule, loadMap) {
        this.x = x;
        this.y = y;
        this.schedule = schedule;
        this.loadMap = loadMap;
    }
}
