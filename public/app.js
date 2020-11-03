//Open and connect socket
let socket = io();
let balls = [];
let ballNumber = 10;

//Listen for confirmation of connection
socket.on('connect', function() {
    console.log("Connected");
});

function setup() {
    createCanvas(1000, 1000);
    background(random(100, 220));
    socket.on('ballData', (data) => {
        console.log(data);
        removeBalls(data); // go to line 90

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


    for (let i = 0; i < balls.length; i++) {
        // this decremental loop is working too
        // for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[i].contains(mouseX, mouseY)) {
            balls.splice(i, 1);
            // PS:this is not working... wait... yes!! it's working with a decremental for loop!!! 7.5: Removing Objects from Arrays - p5.js Tutorial
            ballNumber = balls.length;

            let data = {
                x: mouseX,
                y: mouseY,
                left: ballNumber
            }
            socket.emit('ballData', data);
        }


    }


};

function draw() {

    background(random(100, 220));
    for (let ball of balls) {
        if (ball.contains(mouseX, mouseY)) {
            ball.changeColor(255);
        } else {
            ball.changeColor(0);
        }
        ball.move();
        ball.show();
        if (balls.length <= 5) {

            textSize(50);
            fill(0);
            noStroke();
            textAlign(CENTER);
            text("YOU ARE ALMOST THERE!", 500, 500);
        }
        if (balls.length == 0) {
            // this is not working as well
            textSize(50);
            fill(0);
            noStroke();
            textAlign(CENTER);
            text("YOU WIN!", 500, 500);
        }
    }
};

function removeBalls(data) {
    console.log(data);
    balls.splice(balls.length - 1, 1);
}

// my ball DNA(class)
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
        stroke(0);
        strokeWeight(1);
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