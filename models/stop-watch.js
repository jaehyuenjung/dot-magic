class StopWatch {
    constructor() {
        this.curTime = 0;
        this.active = false;
        this.span = document.createElement("span");
        this.span.innerText = `${round(this.curTime, 2)} seconds...`;
        this.span.classList.add("stop-watch");
        document
            .querySelector("#canvas-container > main")
            .appendChild(this.span);
    }
    reset() {
        this.curTime = 0;
    }
    start() {
        if (!this.active) {
            this.active = true;
        }
    }
    stop() {
        if (this.active) this.active = false;
    }

    update() {
        push();
        if (this.active) {
            this.curTime += deltaTime / 1000;
        }
        this.span.innerText = `${round(this.curTime, 2)} seconds...`;

        if (this.active && this.span.classList.contains("stop-watch__stop"))
            this.span.classList.toggle("stop-watch__stop");
        else if (
            !this.active &&
            !this.span.classList.contains("stop-watch__stop")
        )
            this.span.classList.toggle("stop-watch__stop");

        pop();
    }
}
