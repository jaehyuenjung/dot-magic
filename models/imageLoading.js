class ImageLoading {
    constructor(progress = 0) {
        this.progress = progress;
        this.container = document.getElementById("loading-container");
        this.progressBar = document.querySelector(
            "#progress-container > .progress-bar"
        );
        this.stateContent = document.querySelector(
            "#progress-state-container .state_content"
        );
        this.stateValue = document.querySelector(
            "#progress-state-container .state_value"
        );
        this.dotContainer = document.querySelector(
            "#progress-state-container .state_dot-container"
        );
        this.visible = false;
    }

    reset() {
        this.progress = 0;
        this.progressBar.setAttribute("value", 0);
        this.stateValue.innerText = "0%";
        this.stateContent.innerText = "";
    }

    isLoading() {
        return this.visible;
    }

    update(progress, content) {
        if (this.progress >= 0 && this.progress < 100) {
            if (!this.visible) {
                this.visible = true;
            }
            this.progress = progress;

            this.progressBar.setAttribute("value", progress);
            this.stateValue.innerText = `${progress}%`;

            if (content) {
                this.stateContent.innerText = content;

                if (
                    this.dotContainer.classList.contains(
                        "state_dot-container__hidden"
                    )
                ) {
                    this.dotContainer.classList.toggle(
                        "state_dot-container__hidden"
                    );
                }
            }

            if (progress === 100) {
                setTimeout(() => {
                    if (this.visible) {
                        this.visible = false;

                        this.dotContainer.classList.toggle(
                            "state_dot-container__hidden"
                        );
                    }
                }, 500);
            }
        }
    }

    draw() {
        if (
            (this.visible &&
                this.container.classList.contains(
                    "loading-container__hidden"
                )) ||
            (!this.visible &&
                !this.container.classList.contains("loading-container__hidden"))
        ) {
            this.container.classList.toggle("loading-container__hidden");
        }
    }
}
