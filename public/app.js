//Open and connect socket
let socket = io();
let balls = [];
let ballClear = 0;
let readytoplay = false;
let removal = false;

// glowing orb with this / pixelDensity ? by Ivy Meadows https://editor.p5js.org/ivymeadows/sketches/Hy_11EQWG

// let img;

// function preload() {
//     img = loadImage("Treasure_and_Turmoil_low.jpg");
// }

//Listen for confirmation of connection
socket.on('connect', () => {
    console.log("Connected");
    socket.emit('joined')
});

window.addEventListener('load', () => {
    document.getElementById('team-play').addEventListener('click', () => {
        joinLevel('team-play');
    })
    document.getElementById('versus-play').addEventListener('click', () => {
        joinLevel('versus-play');
    })

    //when user types a new message and "sends" it
    let sendbutton = document.getElementById('send-button');
    sendbutton.addEventListener('click', () => {
        let message = document.getElementById("send-input").value;
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
socket.on('levelMsg', (data) => {
    document.getElementById('level-msg').innerHTML = "";
    for (let i = 0; i < data.messages.length; i++) {
        let elt = document.createElement('h3');
        elt.innerHTML = data.messages[i];
        document.getElementById('level-msg').appendChild(elt);
    }

    document.getElementById('score1').innerHTML = data.score1;
    document.getElementById('scoreNum').innerHTML = data.score2;
    document.getElementById('score3').innerHTML = data.score3;

})

socket.on('newMsg', (data) => {
    document.getElementById('new-msg').innerHTML = "";
    let elt2 = document.createElement('p');
    elt2.innerHTML = data.message;
    document.getElementById('new-msg').appendChild(elt2);
    console.log(data);
})

socket.on('removeData', () => {
    console.log(balls)
    for (let k = 0; k < balls.length; k++) {
        // if (ball.contains(mouseX, mouseY)) {
        //     ball[k].changeColor();
        // }
        balls[k].swell();
        setTimeout(function() {
            balls[k].shrink();
        }, 500);
    }
})

function setup() {
    createCanvas(2000, 2000);

    // // createCanvas(720, 200);
    // pixelDensity(1);
    // img.loadPixels();
    // loadPixels();

    // SEND UPDATE GAME DATA
    socket.on('gameData', (data) => {
        console.log(data);
        removeBalls(data);
    });

    // SEND UPDATED SCORES
    socket.on('newData', (data) => {
        document.getElementById('scoreNum').innerHTML = data.scores;
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

function draw() {

    background(0);
    fill(255);
    ellipse(20, 20, 40);
    ellipse(1980, 1980, 40);
    ellipse(20, 1980, 40);
    ellipse(1980, 20, 40);

    // for (let x = 0; x < img.width; x++) {
    //     for (let y = 0; y < img.height; y++) {
    //         // Calculate the 1D location from a 2D grid
    //         let loc = (x + y * img.width) * 4;
    //         // Get the R,G,B values from image
    //         let r, g, b;
    //         r = img.pixels[loc];
    //         // Calculate an amount to change brightness based on proximity to the mouse
    //         let maxdist = 25;
    //         let d = dist(x, y, mouseX, mouseY);
    //         let adjustbrightness = 100 * (maxdist - d) / maxdist;
    //         r += adjustbrightness;
    //         // Constrain RGB to make sure they are within 0-255 color range
    //         r = constrain(r, 0, 255);
    //         // Make a new color and set pixel in the window
    //         let c = color(r, g, b);
    //         let pixloc = (y * width + x) * 4;
    //         pixels[pixloc] = r;
    //         pixels[pixloc + 1] = r;
    //         pixels[pixloc + 2] = r;
    //         pixels[pixloc + 3] = 255;
    //     }
    // }
    // updatePixels();

    for (let ball of balls) {
        readytoplay = true;
        if (ball.contains(mouseX, mouseY)) {
            ball.changeColor(255);
        } else {
            ball.changeColor(0);
        }
        ball.move();
        ball.show();
        if (readytoplay && balls.length >= 20) {
            textSize(50);
            fill(200);
            noStroke();
            textAlign(CENTER);
            text("NAVIGATE TO FIND BALLS", 1000, 1000);
        }
        if (balls.length <= 6 && balls.length >= 3) {
            textSize(50);
            fill(200);
            noStroke();
            textAlign(CENTER);
            text("WE ARE ALMOST THERE!", 1000, 1000);
        }
    }
    if (balls.length < 3 && readytoplay) {
        textSize(50);
        fill(200);
        noStroke();
        textAlign(CENTER);
        text("YOU BRING US TO THE HYDROTHERMAL VENT!", 1000, 1000);
    }
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
            // for the two games this can be different
            socket.emit('gameData', data);

            // 1 there will another socket emit ...
            socket.emit('removeData');
        }
    }
};

function removeBalls(data) {
    // console.log(data);
    balls.splice(data.ballNo, 1);
    removal = true;
}

// my ball DNA(class)
class Ball {
    // constructor(x, y, r, xspeed, yspeed) {
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.a = random(255);
        this.brightness = random(100, 200);
        this.strokeR = 255;
        this.strokeG = 255;
        this.strokeB = 255;
        this.strokeA = random(255);
        this.strokeWeight = 0;
        // this.removal = removal;
        // this.xspeed = xspeed;
        // this.yspeed = yspeed;
    }

    swell() {
        this.a += 50;
        this.r += 10;
        this.strokeWeight += random(10);
        this.strokeR -= random(255);
        this.strokeG -= random(100);
        this.strokeB -= random(50);
        // this.stroke = color(0, 0, 255);
        // this.strokeWeight = strokeWeight(10);
    }

    shrink() {
        this.a -= 50;
        this.r -= 10;
        this.strokeWeight = 0;
        this.strokeR = 255;
        this.strokeG = 255;
        this.strokeB = 255;
        this.strokeA = random(255);
        // this.stroke = color(255);
        // this.strokeWeight = strokeWeight(1.5);
    }

    show() {
        console.log('show balls');
        stroke(this.strokeR, this.strokeG, this.strokeB, this.strokeA);
        strokeWeight(this.strokeWeight);
        fill(this.brightness, this.a);
        ellipse(this.x * 3, this.y * 3, this.r * 3);
    }

    move() {
        this.x += random(1, -1);
        this.y += random(1, -1);
        // this.x = this.x + this.xspeed;
        // this.y = this.y + this.yspeed;
        // console.log(this.yspeed);
    }

    changeColor(bright) {
        this.brightness = bright;
    }

    contains(containedX, containedY) {
        let d = dist(containedX, containedY, this.x * 3, this.y * 3);
        if (d < this.r * 1.5) {
            // console.log("ball clicked");
            return true;
        } else {
            return false;
        }
    }
}