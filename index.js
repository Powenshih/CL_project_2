let express = require('express');
let app = express();
app.use('/', express.static('public'));

//Initialize the actual HTTP server
let http = require('http');
let server = http.createServer(app);
let port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log("Server listening at port: " + port);
});

//Initialize socket.io
let io = require('socket.io').listen(server);

io.sockets.on('connect', function(socket) {
    console.log("A new client connected : " + socket.id);

    socket.on('balldata', (data) => {
        console.log(data);
        io.sockets.emit('balldata', data);
    });

    socket.on('disconnected', function() {
        console.log("A client has disconnected : " + socket.id);
    });


});