class Point {

    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
    }

    next() {
        this.x += this.vx;
        this.y += this.vy;
    }

    prev() {
        this.x -= this.vx;
        this.y -= this.vy;
    }

    // move multiple at once
    proceed(turns) {
        this.x += turns * this.vx;
        this.y += turns * this.vy;
    }
}

let pointsArr = [];
let minDistance = 0;
let turn = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getColourIndicesForCoord(x, y, width) {
    let red = y * (width * 4) + x * 4;

    return {
        "red": red,
        "green": red + 1,
        "blue": red + 2,
        "alpha": red + 3
    }
}

function setVirtualPixel(data, x, y, rgba, scale) {
    let xStart = x * scale;
    let yStart = y * scale;

    let xEnd = (x + 1) * scale;
    let yEnd = (y + 1) * scale;

    for (let i = xStart; i < xEnd; i++) {
        for (let j = yStart; j < yEnd; j++) {
            let indices = getColourIndicesForCoord(i, j, 1000);

            data.data[indices.red] = rgba.red;
            data.data[indices.green] = rgba.green;
            data.data[indices.blue] = rgba.blue;
            data.data[indices.alpha] = rgba.alpha;
        }
    }

    return data;
}

function parseInput(raw) {
    let points = []

    let split = raw.split('\n');

    let indexes = [];

    for (let i = 0; i < split[0].length; i++) {
        if (split[0][i] === '<' || split[0][i] === ',' || split[0][i] === '>') indexes.push(i);
    }

    for (let line of raw.split('\n')) {
        let x = Number(line.slice(indexes[0] + 1, indexes[1]));
        let y = Number(line.slice(indexes[1] + 2, indexes[2]));

        let vx = Number(line.slice(indexes[3] + 1, indexes[4]));
        let vy = Number(line.slice(indexes[4] + 2, indexes[5]));

        points.push(new Point(x, y, vx, vy));
    }
    updateDistance(points);
    turn = 0;

    document.getElementById("points").innerText = "Points: " + points.length;
    document.getElementById("turn").innerText = "Seconds: 0";

    for (let i of document.getElementsByTagName("input")) {
        i.disabled = false;
    }

    clearCanvas();

    return points;
}

function clearCanvas() {
    let context = document.getElementById("canvas").getContext("2d");

    context.putImageData(context.createImageData(canvas.width, canvas.height), 0, 0);
}

function render(points) {
    let canvas = document.getElementById("canvas");
    let context = canvas.getContext("2d");

    let data = context.createImageData(canvas.width, canvas.height);
    const colour = {
        red: 255,
        green: 0,
        blue: 0,
        alpha: 255
    };

    let min = [
        Math.min(... points.map(p => p.x)),
        Math.min(... points.map(p => p.y))
    ];

    let max = [
        Math.max(... points.map(p => p.x)),
        Math.max(... points.map(p => p.y))
    ];

    let offset = [-min[0], -min[1]];
    let maxDiff = Math.max(max[0] - min[0], max[1] - min[1])

    if (maxDiff > 1000) scale = 1;
    else scale = Math.floor(1000 / maxDiff);

    while (1000 % scale !== 0) scale--;

    console.log(`Scale: ${scale}, diff: ${maxDiff}, offset: ${offset}`);

    for (let point of points) {
        if (point.x + offset[0] < 1000 && point.y + offset[1] < 1000) 
            data = setVirtualPixel(data, point.x + offset[0], point.y + offset[1], colour, scale);
    }

    context.putImageData(data, 0, 0);
}

function distance(p1, p2) {
    return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
}

function updateDistance(points) {
    minDistance = Math.min(... 
        points.map(
            point => {
                return Math.max(... 
                    points.map(point2 => distance(point, point2))
                );
            }
        )
    );
}

async function run(points) {
    document.getElementById("run").disabled = true;

    let x = 0;

    let prevMin = minDistance + 1;

    console.log(minDistance);

    while (prevMin > minDistance) {
        prevMin = minDistance;

        proceedBy(points, Math.ceil(minDistance / 500));

        updateDistance(points);
        
        if (minDistance < 1000 && prevMin > minDistance) {
            render(points);
            await sleep(10);
        }
        else await sleep(2);
    }

    proceedBy(points, -1);

    render(points);
}

function proceedBy(points, amount) {
    points.forEach(point => point.proceed(amount));

    turn += amount;
    document.getElementById("turn").innerText = "Seconds: " + turn;
}