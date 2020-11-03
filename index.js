// Initialize the express 'app' object
let express = require('express');
let app = express();
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
io.sockets.on('connect', function(socket) {
    console.log("A new client connected : " + socket.id);

    // Send the data to all the clients including this 
    // Set the name of the message to be ballData'
    socket.on('ballData', (data) => {
        console.log(data);
        io.sockets.emit('ballData', data);
        // socket.broadcast.emit('ballData', data);
    });

    // Listen for this client to disconnect
    socket.on('disconnected', function() {
        console.log("A client has disconnected : " + socket.id);
    });


});