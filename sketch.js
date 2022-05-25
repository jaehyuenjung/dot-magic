let count = 8;
let per = 16;
let randPosList = [];
let myPixels = [];
let stopWatch;
let workerManager;

function setup() {
    const canvas = createCanvas(500, 500);

    background(255);
    fill(0);
    noStroke();
    textSize(24);
    textAlign(CENTER);
    text("Drag an image file onto the canvas.", width / 2, height / 2);

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

    workerManager = new WorkerManager(
        count,
        randPosList,
        myPixels,
        width,
        height
    );
    stopWatch = new StopWatch();
    stopWatch.start();
    canvas.drop(gotFile);
}

function draw() {
    const deltaT = millis() / 1000;

    if (workerManager.isDone()) {
        stopWatch.stop();
    }

    workerManager.update(deltaT);
    stopWatch.update();
}

function windowResized() {
    stopWatch.reSize();
}

function gotFile(file) {
    if (file.type === "image") {
        var img = createImg(file.data, " ", "", () => {
            const preImage = get();
            image(img, 0, 0, width, height);

            myPixels.forEach((arr) => {
                arr.forEach((pixel) => {
                    pixel.init(
                        color(preImage.get(pixel.x, pixel.y)),
                        color(get(pixel.x, pixel.y))
                    );
                });
            });

            randPosList = shuffle(
                Array.from({ length: myPixels.length }, (_, i) => i)
            );

            workerManager.init(count, randPosList, myPixels, width, height);
            stopWatch.reset();
            stopWatch.start();
        }).hide();
    } else {
        console.log("Not an image file!");
    }
}
