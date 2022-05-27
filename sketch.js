let count = 8;
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

    myPixels.forEach((arr) =>
        arr.forEach((pixel) => {
            pixel.init(
                color(preImage.get(pixel.x, pixel.y)),
                color(get(pixel.x, pixel.y))
            );
            setTimeout(() => {
                progress += 1;
                imageLoading.update(round((progress / max) * 100, 1));
            }, 0);
        })
    );
}

function setup() {
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

    background(255);
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("Load an image file onto the canvas.", width / 2, height / 2);

    let index = 0;
    for (let i = 0; i < height; i += per) {
        for (let j = 0; j < width; j += per) {
            const arr = [];
            for (let k = 0; k < per * per; k++) {
                const posX = j + (k % per);
                const posY = i + floor(k / per);
                if (posX < width && posY < height) {
                    arr.push(
                        new Pixel(
                            posX,
                            posY,
                            color(255),
                            color(get(posX, posY))
                        )
                    );
                }
            }
            myPixels[index] = arr;
            index += 1;
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
    canvas.drop(gotFile);
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

function gotFile(file) {
    if (file.type.includes("image")) {
        imageLoading.reset();
        imageLoading.update(0);
        var img = createImg(file.data, " ", "", () => {
            pixelLoad(img);
            randPosList = shuffle(
                Array.from({ length: myPixels.length }, (_, i) => i)
            );

            laserManager.init(count, randPosList, myPixels, width, height);
            stopWatch.reset();
            stopWatch.start();
        }).hide();
    } else {
        console.log("Not an image file!");
    }
}
