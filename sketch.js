let page = 1;
let scrolling = false;

let count = 1;
let per = 32;

let randPosList = [];
let myPixels = [];

let stopWatch;
let laserManager;
let imageLoading;

function pixelLoad(img) {
    const preImage = get();
    image(img, 0, 0, width, height);

    let progress = 0;
    const max = myPixels.reduce((result, arr) => result + arr.length, 0);
    loadPixels();
    preImage.loadPixels();
    setTimeout(() => {
        imageLoading.update(20, "Pixels Load");
    }, 0);
    myPixels.forEach(async (arr) => {
        arr.forEach((pixel) => {
            pixel.init(
                color(
                    Array.from(
                        { length: 4 },
                        (_, i) => preImage.pixels[pixel.index + i]
                    )
                ),
                color(
                    Array.from({ length: 4 }, (_, i) => pixels[pixel.index + i])
                )
            );
        });
        setTimeout(() => {
            progress += arr.length;
            const percentange = round((progress / max) * 100);
            const content = percentange === 100 ? "complete" : "";
            imageLoading.update(20 + round(percentange * 0.8), content);
        }, 0);
    });
}

function setup() {
    pixelDensity(1);
    const canvas = createCanvas(500, 500);
    canvas.canvas.onclick = () => {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        input.onchange = (e) => {
            const el = e.target;

            if (el.files && el.files[0]) {
                el.files[0].data = URL.createObjectURL(el.files[0]);
                gotFile(el.files[0]);
                URL.revokeObjectURL(el.files[0]);
            }

            input.remove();
        };
        input.click();
    };

    canvas.canvas.ondragover = (event) => {
        event.preventDefault();
    };
    canvas.canvas.ondrop = (event) => {
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            gotFile(event.dataTransfer.files[0]);
        }
        event.preventDefault();
    };

    background(255);
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("Load an image file onto the canvas.", width / 2, height / 2);

    loadPixels();
    for (let i = 0; i < height; i += per) {
        for (let j = 0; j < width; j += per) {
            const arr = [];
            for (let k = 0; k < per * per; k++) {
                const posX = j + (k % per);
                const posY = i + floor(k / per);
                const pos = 4 * (posY * width + posX);
                if (posX < width && posY < height) {
                    arr.push(
                        new Pixel(
                            posX,
                            posY,
                            pos,
                            color(255),
                            color([
                                pixels[pos + 0],
                                pixels[pos + 1],
                                pixels[pos + 2],
                                pixels[pos + 3],
                            ])
                        )
                    );
                }
            }
            myPixels.push(arr);
        }
    }

    randPosList = shuffle(Array.from({ length: myPixels.length }, (_, i) => i));
    background(255);

    laserManager = new LaserManager(
        count,
        randPosList,
        myPixels,
        width,
        height
    );
    stopWatch = new StopWatch();
    stopWatch.start();

    imageLoading = new ImageLoading();
}

function draw() {
    if (!imageLoading.isLoading()) {
        const deltaT = millis() / 1000;

        if (laserManager.isDone()) {
            stopWatch.stop();
        }

        laserManager.update(deltaT);
        stopWatch.update();
    }
    imageLoading.draw();
}

async function gotFile(file) {
    if (file.type.includes("image")) {
        imageLoading.reset();
        imageLoading.update(0, "Image Load");
        loader(URL.createObjectURL(file), (p) => {
            setTimeout(() => {
                imageLoading.update(round(p * 0.2));
            }, 0);
        }).then((url) => {
            var img = createImg(url, " ", "", () => {
                pixelLoad(img);
                randPosList = shuffle(
                    Array.from({ length: myPixels.length }, (_, i) => i)
                );

                laserManager.init(count, randPosList, myPixels, width, height);
                stopWatch.reset();
                stopWatch.start();
            }).hide();
        });
    } else {
        console.log("Not an image file!");
    }
}

// fullpage 스크롤 관련
window.addEventListener("scroll", (event) => {
    event.preventDefault();
    let flag = true;
    const halfHeight = document.body.clientHeight / 2;
    if (page === 1 && window.scrollY > 0 + document.body.clientHeight * 0.06)
        page = 2;
    else if (
        page === 2 &&
        window.scrollY < halfHeight - document.body.clientHeight * 0.06
    )
        page = 1;
    else flag = false;

    if (flag && !scrolling) {
        if (page === 1) scrollToTop(window.scrollY, 0);
        else scrollToTop(window.scrollY, halfHeight);
    }
    return false;
});

function scrollToTop(from, to, duration = 0.2) {
    if (!scrolling) {
        scrolling = true;
        let prev = Date.now();
        const scroll = () => {
            const now = Date.now();
            const t = Math.min((now - prev) / 1000 / duration, 1);
            const pos = (1 - t) * from + t * to;
            window.scrollTo(0, pos);

            if (t === 1) {
                scrolling = false;
                return;
            } else {
                requestAnimationFrame(scroll);
            }
        };
        requestAnimationFrame(scroll);
    }
}
