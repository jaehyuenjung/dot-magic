class Slider {
    constructor(label) {
        this.slider = document.querySelector(
            `.round-slider-container > .round-slider__${label}`
        );
        this.sliderValue = document.querySelector(
            `.round-slider-container .slider-${label}-value`
        );

        this.value = this.slider.value;
        this.slider.addEventListener("value-changing", (event) => {
            this.sliderValue.innerText = event.detail.value;
        });
    }

    isChange() {
        return this.value !== this.slider.value;
    }

    update() {
        this.value = this.slider.value;
    }

    showProgressBar(visible, duration = 1) {
        if (visible) {
            const from = this.slider.min;
            const to = this.value;
            const prev = Date.now();
            const countNum = () => {
                const now = Date.now();
                const t = Math.min((now - prev) / 1000 / duration, 1);
                const value = round((1 - t) * from + t * to);
                this.slider.value = value;
                this.sliderValue.innerText = value;
                if (t === 1) {
                    return;
                } else {
                    requestAnimationFrame(countNum);
                }
            };
            requestAnimationFrame(countNum);
        } else {
            this.slider.value = this.slider.min;
            this.sliderValue.innerText = this.slider.min;
        }
    }
}
