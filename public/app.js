//Open and connect socket
let socket = io();
let balls = [];

window.addEventListener('load', () => {
    document.getElementById('easy').addEventListener('click', () => {
        joinLevel('easy');
    })
    document.getElementById('hard').addEventListener('click', () => {
        joinLevel('hard');
    })

    //when user types a new message and "sends" it
    let sendbutton = document.getElementById('send-button');
    sendbutton.addEventListener('click', () => {
        let message = document.getElementById("my-message").value;
        socket.emit('newmessage', {
            message: message
        })
    })
});

function joinLevel(levelName) {
    let data = {
        level: levelName
    }
    socket.emit('joinLevel', data);
}

socket.on('levelMessages', (data) => {
    console.log(data);
    document.getElementById('messages').innerHTML = "";
    for (let i = 0; i < data.messages.length; i++) {
        let elt = document.createElement('p');
        elt.innerHTML = data.messages[i];
        document.getElementById('messages').appendChild(elt);

    }
})

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
    socket.emit('joined')
});

function setup() {
    createCanvas(1000, 1000);
    // background(random(100, 220));
    socket.on('gameData', (data) => {
        console.log(data);
        removeBalls(data); // go to line 90
    });

    socket.on('start the game', (data) => {
        let ballData = data.data;
        console.log(ballData);
        console.log(data);
        // new loop to circulate ballData[]
        for (let j = 0; j < ballData.length; j++) {
            // console.log(i);
            // console.log(ballData[i].x);
            let x = ballData[j].x;
            let y = ballData[j].y;
            let r = ballData[j].r;
            let b = new Ball(x, y, r);
            balls.push(b);
        }

    });
    // colorMode(HSB);
};

function mouseDragged() {

    for (let j = 0; j < balls.length; j++) {
        // this decremental loop is working too
        // for (let i = balls.length - 1; i >= 0; i--) {
        if (balls[j].contains(mouseX, mouseY)) {
            balls.splice(j, 1);

            ballLeft = balls.length;
            console.log(balls.length);
            let data = {
                x: mouseX,
                y: mouseY,
                left: ballLeft,
                kill: 0,
            }
            socket.emit('gameData', data);
        }
    }
};

function draw() {

    // background(random(100, 220));
    background(255);
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
    // console.log(data);
    balls.splice(balls.length - 1, 1);
    data.kill++
}

// my ball DNA(class)
class Ball {
    // constructor(x, y, r, xspeed, yspeed) {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.brightness = 0;
        // this.xspeed = xspeed;
        // this.yspeed = yspeed;
    }

    move() {
        this.x = this.x + random(5, -5);
        this.y = this.y + random(5, -5);
        // this.x = this.x + this.xspeed;
        // this.y = this.y + this.yspeed;
        // console.log(this.yspeed);
    }

    show() {
        stroke(0);
        strokeWeight(1);
        fill(this.brightness, 200);
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