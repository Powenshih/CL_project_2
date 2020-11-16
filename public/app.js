//Open and connect socket
let socket = io();
let balls = [];
let ballClear = 0;
let readytoplay = false;

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
    socket.emit('joined')
});

window.addEventListener('load', () => {
    document.getElementById('team').addEventListener('click', () => {
        joinLevel('team');
    })
    document.getElementById('versus').addEventListener('click', () => {
        joinLevel('versus');
    })

    //when user types a new message and "sends" it
    let sendbutton = document.getElementById('send-button');
    sendbutton.addEventListener('click', () => {
        let message = document.getElementById("my-message").value;
        console.log(message);
        socket.emit('newMsg', {
            message: message
        })
    })
});

// JOIN LEVEL
function joinLevel(levelData) {
    let data = {
        level: levelData
    }
    socket.emit('joinLevel', data);
}

// SHOWING MESSAGE DATA
socket.on('levelMessages', (data) => {
    // console.log('newMsgs!');
    // console.log(data);
    // console.log(data.newMsgs);
    document.getElementById('messages').innerHTML = "";
    for (let i = 0; i < data.messages.length; i++) {
        let elt = document.createElement('h3');
        elt.innerHTML = data.messages[i];
        document.getElementById('messages').appendChild(elt);
    }
    // undefined

    document.getElementById('scoreIs').innerHTML = data.scoreIs;
    document.getElementById('scores').innerHTML = data.scores;

    // let elt3 = document.createElement('h1');
    // elt3.id = 'scores';
    // elt3.innerHTML = data.scores;
    // document.getElementById('scores').appendChild(elt3);
})

socket.on('newMsg', (data) => {
    document.getElementById('newMsgs').innerHTML = "";
    let elt2 = document.createElement('p');
    elt2.innerHTML = data.message;
    document.getElementById('newMsgs').appendChild(elt2);
    console.log(data);
})

function setup() {
    createCanvas(1200, 800);

    // SEND UPDATE GAME DATA
    socket.on('gameData', (data) => {
        console.log(data);
        removeBalls(data);
        // spliceInteraction(data);
    });

    // SEND UPDATED SCORES
    socket.on('newData', (data) => {
        document.getElementById('scores').innerHTML = data.scores;
    });

    // GENERATE BALLS 
    socket.on('gameStart', (data) => {
        let ballData = data.data;
        console.log(ballData);
        console.log(data);
        // new loop to circulate ballData[]
        balls = []; // go back to original state
        for (let j = 0; j < ballData.length; j++) {
            let x = ballData[j].x;
            let y = ballData[j].y;
            let r = ballData[j].r;
            let b = new Ball(x, y, r);
            balls.push(b);
        }
    });
};

// MOUSE DRAGGED INTERACTION
function mouseDragged() {

    for (let j = 0; j < balls.length; j++) {
        if (balls[j].contains(mouseX, mouseY)) {
            balls.splice(j, 1);
            ballLeft = balls.length;
            ballNumber = j;
            ballClear++;

            let data = {
                x: mouseX,
                y: mouseY,
                left: ballLeft,
                clear: ballClear,
                ballNo: ballNumber,
            };
            socket.emit('gameData', data);
        }
    }
};

function draw() {

    background(0);

    for (let ball of balls) {
        readytoplay = true;
        if (ball.contains(mouseX, mouseY)) {
            ball.changeColor(255);
        } else {
            ball.changeColor(0);
        }
        ball.move();
        ball.show();
        if (balls.length <= 6 && balls.length >= 3) {
            textSize(20);
            fill(200);
            noStroke();
            textAlign(CENTER);
            text("YOU ARE ALMOST THERE!", 600, 400);
        }
    }
    if (balls.length < 3 && readytoplay) {
        textSize(20);
        fill(200);
        noStroke();
        textAlign(CENTER);
        text("YOU GET TO THE HYDROTHERMAL VENT!", 600, 400);
    }
};

// let removal = false;
// function spliceInteraction(data) {
//     removal = true;
// }

function removeBalls(data) {
    // console.log(data);
    balls.splice(data.ballNo, 1);
    // console.log(data.ballNumber)

}

// my ball DNA(class)
class Ball {
    // constructor(x, y, r, xspeed, yspeed) {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.brightness = random(100, 200);
        // this.xspeed = xspeed;
        // this.yspeed = yspeed;
    }

    move() {
        this.x = this.x + random(2.5, -2.5);
        this.y = this.y + random(2.5, -2.5);
        // this.x = this.x + this.xspeed;
        // this.y = this.y + this.yspeed;
        // console.log(this.yspeed);
    }

    show() {
        // if (spliceInteraction()) {
        // removal = true;
        // stroke(255);
        // strokeWeight(1);
        // fill(50, 50, 200);
        // ellipse(this.x, this.y, this.r * 3);
        // noLoop();
        // } else {
        stroke(255);
        strokeWeight(1);
        fill(this.brightness, 150);
        ellipse(this.x, this.y, this.r * 2);
        // }
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