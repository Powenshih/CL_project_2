//Open and connect socket
let socket = io();
// let brush;
let ellipseSize = 20;
let balls = [];
let ballNumber = 10;

//Listen for confirmation of connection
socket.on('connect', function() {
    console.log("Connected");
});

function setup() {
    createCanvas(1000, 1000);
    background(random(100, 220));
    socket.on('balldata', (data) => {
        console.log(data);
        // remove(data);
        // drawEllipses(data);
    });
    for (let i = 0; i < ballNumber; i++) {
        let x = random(width);
        let y = random(height);
        let r = random(30, 100);
        let b = new Ball(x, y, r);
        balls.push(b);
    }
    colorMode(HSB);
    // brush = random(0, 360);
};

function mouseDragged() {
    let data = {
        x: mouseX,
        y: mouseY,
        // color: brush,
        left: ballNumber
    }

    for (let i = 0; i < balls.length; i++) {
        // this decremental loop is working too
        // for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].contains(mouseX, mouseY)) {
            balls.splice(i, 1);
            // PS:this is not working... wait... yes!! it's working with a decremental for loop!!! 7.5: Removing Objects from Arrays - p5.js Tutorial
            ballNumber = balls.length;
        }

    }
    // ellipse(mouseX, mouseY, 20, 20);
    socket.emit('balldata', data);
};

function draw() {

    background(random(100, 220));
    for (let i = 0; i < balls.length; i++) {
        if (balls[i].contains(mouseX, mouseY)) {
            balls[i].changeColor(255);
        } else {
            balls[i].changeColor(0);
        }
        balls[i].move();
        balls[i].show();
        if (balls.length <= 5) {

            textSize(50);
            fill(0);
            noStroke();
            textAlign(CENTER);
            text("YOU ARE KILLER!", 500, 500);
            if (balls.length == 0) {

                textSize(50);
                fill(0);
                noStroke();
                textAlign(CENTER);
                text("YOU WIN!", 500, 500);
            }
        }
    }
};


// function drawEllipses(data) {
// fill(data.color, 100, 100);
// ellipse(data.x, data.y, data.size, data.size);
// }

// this is not working actually
function remove(data) {
    // fill(data.color, 100, 100);
    // ellipse(data.x, data.y, data.size, data.size);
}

// function keyPressed() {
//     if (keyCode == UP_ARROW) {
//         ellipseSize += 10;
//     } else if (keyCode == UP_ARROW) {
//         ellipseSize -= 10;
//     }
// }

// function mouseClicked() {
//     brush = random(255);
// }


// ball DNA
class Ball {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.brightness = 0;
    }

    move() {
        this.x = this.x + random(-5, 5);
        this.y = this.y + random(-5, 5);
    }

    show() {
        stroke(255);
        strokeWeight(1);
        noStroke();
        fill(this.brightness, 100);
        ellipse(this.x, this.y, this.r * 2);
    }

    changeColor(bright) {
        this.brightness = bright;
    }

    contains(containedX, containedY) {
        let d = dist(containedX, containedY, this.x, this.y);
        if (d < this.r) {
            // console.log("ball clicked");
            return true;
        } else {
            return false;
        }
    }
}