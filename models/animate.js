class Animate {
    constructor(start = -1, duration = 0) {
        this.start = start;
        this.end = start + duration;
        this.duration = duration;
    }

    init() {
        this.start = -1;
        this.end = -1;
        this.duration = 0;
    }

    update(start, duration) {
        this.start = start;
        this.end = start + duration;
        this.duration = duration;
    }

    isAnimate(deltaT) {
        return deltaT <= this.end;
    }

    calcT(deltaT) {
        if (this.start <= deltaT && this.end >= deltaT) {
            if (this.duration) {
                return (deltaT - this.start) / this.duration;
            }
            return 1;
        } else if (this.start > deltaT) return 0;
        else return 1;
    }
}
