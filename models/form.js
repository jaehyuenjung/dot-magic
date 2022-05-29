class Form {
    constructor() {
        this.labels = ["count", "per", "duration"];
        this.form = document.querySelector("form-container > form");
        this.sliders = this.labels.map((label) => new Slider(label));
        this.values = this.sliders.map((slider) => slider.value);
    }

    pageLoad(visible, changeCallback) {
        if (
            !visible &&
            changeCallback &&
            this.sliders.some((slider) => slider.isChange())
        ) {
            this.sliders.forEach((slider) => slider.update());
            this.values = this.sliders.map((slider) => slider.slider.value);
            changeCallback();
        } else {
            this.values = this.sliders.map((slider) => slider.value);
        }
        this.sliders.forEach((slider) => slider.showProgressBar(visible));
    }
}
