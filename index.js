// Initialize the express 'app' object
let express = require('express');
let app = express();
let levels = ["easy", "hard"];
let scores = 0;

// instructional msg for levels
let messages = {
    "team": [
        "Great choice!, Here is how to play the game:",
        "Simply dragged you mouse and clear the balls to get to THE DEEP.",
    ],
    "versus": [
        "Wow, you have advanced!, Here is how to play the game:",
        "Dragged and clear the balls to get to THE DEEP, Press GIFT button to add balls to opponents' canvas"
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

// Listen for individual client/user to connect
io.sockets.on('connect', (socket) => {
    console.log("A new client connected : " + socket.id);

    // New setup to allow to join to level and enable sharing datas
    socket.on('joinLevel', (data) => {

        // JOINING LEVEL DATA
        let levelData = data.level;
        console.log(socket.id + "joined level : " + levelData);
        socket.join(levelData);
        socket.levelData = levelData

        // JOINING MESSAGE DATA
        let messageData = {
            "messages": messages[levelData],
            "scoreIs": "Your score is:",
            "scores": scores,
            "newMsg": "New message from player 2:" + "Hi there",
        };
        socket.emit('levelMessages', messageData); // send the data only to this client

        // JOINING BALL DATA --> line 89
        let ballData = { data: joinBall };
        socket.emit('gameStart', ballData); // send the data only to this client

    });

    // On getting a NEW MESSAGE
    socket.on('newMsg', (data) => {
        // io.to(socket.levelData).emit('newMsg', data);
        io.sockets.emit('newMsg', data);
        messages[socket.levelData].push(data.message);
        console.log(messages);
    });

    // UPDATE BALL DATA TO "OTHER" CLIENTS
    socket.on('gameData', (data) => {
        console.log(data);
        socket.broadcast.emit('gameData', data); // send data back excluding "this" player

        // UPDATE NEW SCORE (HOW MANY BALLS ARE CLEARED)
        scores++;
        let newData = { "clientData": data, "scores": scores };
        io.sockets.emit('newData', newData);
    });

    // Listen for this client to disconnect
    socket.on('disconnected', () => {
        console.log("A client has disconnected : " + socket.id);
    });
});

// JONING BALL DATA
let joinBall = [
    { x: 10, y: 737, r: 37 },
    { x: 200, y: 522, r: 80 },
    { x: 187, y: 15, r: 120 },
    { x: 203, y: 148, r: 60 },
    { x: 568, y: 595, r: 50 },
    { x: 1135, y: 886, r: 70 },
    { x: 800, y: 737, r: 12 },
    { x: 25, y: 522, r: 200 },
    { x: 187, y: 600, r: 94 },
    { x: 357, y: 459, r: 12 },
    { x: 481, y: 50, r: 45 },
    { x: 922, y: 786, r: 150 },
    { x: 735, y: 200, r: 30 },
    { x: 481, y: 300, r: 45 },
    { x: 900, y: 100, r: 100 },
    { x: 1100, y: 35, r: 45 },
    { x: 936, y: 786, r: 200 },
    { x: 735, y: 123, r: 10 },
    { x: 345, y: 635, r: 150 },
    { x: 830, y: 435, r: 178 }
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