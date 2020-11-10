// Initialize the express 'app' object
let express = require('express');
let app = express();

let levels = ["easy", "hard"];

let messages = {
    "easy": [
        "Great choice!",
        "Here is how to play the game:",
        "Simply dragged you mouse and kill the balls.",
        "The fastest win!"
    ],
    "hard": [
        "Wow, you have advanced!",
        "Here is how to play the game:",
        "Dragged and kill the balls",
        "The fastest win",
        "Press GIFT button to add balls to oponents' canvas"
    ]
}

app.use('/', express.static('public'));

// Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

// Initialize socket.io
let io = require('socket.io').listen(server);

// Listen for indivisual clinet/user to connect
io.sockets.on('connect', (socket) => {
    console.log("A new client connected : " + socket.id);

    // new setup to allow to join to levels
    socket.on('joinLevel', (data) => {

            let levelName = data.level;
            console.log(socket.id + "joined level : " + levelName);
            socket.join(levelName);
            socket.levelName = levelName;

            let messageData = {
                "messages": messages[levelName]
            }
            socket.emit('levelMessages', messageData);

            let ballData = { data: joinBall }
                // io.sockets.emit('start the game', ballData);
                // send the data just to the joined client
            socket.emit('StartTheGame', ballData);
        })
        //on getting a new message
    socket.on('newmessage', (data) => {
        io.to(socket.levelName).emit('newmessage', data);
        messages[socket.levelName].push(data.message);
        console.log(messages);
    })

    // Set the name of the message to be ballData'
    socket.on('gameData', (data) => {
        console.log(data);
        // send data back excluding "this" player
        socket.broadcast.emit('gameData', data);
    });

    // Listen for this client to disconnect
    socket.on('disconnected', () => {
        console.log("A client has disconnected : " + socket.id);
    });
});

let joinBall = [
    { x: 10, y: 737, r: 37 },
    { x: 200, y: 522, r: 80 },
    { x: 187, y: 15, r: 120 },
    { x: 203, y: 148, r: 60 },
    { x: 568, y: 595, r: 50 },
    { x: 600, y: 886, r: 70 },
    { x: 800, y: 737, r: 12 },
    { x: 25, y: 522, r: 200 },
    { x: 187, y: 600, r: 94 },
    { x: 357, y: 459, r: 12 },
    { x: 481, y: 50, r: 45 },
    { x: 922, y: 786, r: 150 },
    { x: 735, y: 200, r: 30 },
    { x: 481, y: 300, r: 45 },
    { x: 900, y: 100, r: 100 }
];

// let randomXspeed = Math.floor(Math.random() * (1 - (-1)));
// let randomYspeed = Math.floor(Math.random() * (1 - (-1)));
// let randomR = Math.floor(Math.random() * (50 - 100));

// new code to make all the joining experience the same
// create an onject send the object
// let joinBall = [
//     { x: 10, y: 737, r: 10, xspeed: randomXspeed, yspeed: randomYspeed },
//     { x: 200, y: 522, r: 20, xspeed: randomXspeed, yspeed: randomYspeed },
//     { x: 187, y: 15, r: 30, xspeed: randomXspeed, yspeed: randomYspeed },
//     { x: 203, y: 148, r: 50, xspeed: randomXspeed, yspeed: randomYspeed },
//     { x: 568, y: 595, r: 50, xspeed: randomXspeed, yspeed: randomYspeed },
//     { x: 222, y: 886, r: 60, xspeed: randomXspeed, yspeed: randomYspeed },
// ];