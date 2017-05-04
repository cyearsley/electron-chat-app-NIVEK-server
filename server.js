var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
//   , fs = require('fs')
app.listen(3000);
function handler (req, res) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
}

var messages = [];

io.on('connection', function (socket) {
	console.log("CONNECTED - ", socket.id);

    socket.on('join room', function (msg) {
        // force the socket to leave all rooms.. before joining another
        socket.leaveAll();

        if (msg.roomName) {
            console.log("Client is joining room: ", msg.roomName);
            socket.join(msg.roomName);
            socket.emit('receive my room',{room: msg.roomName});
        }
    });

    socket.on('request my room', function (msg) {
        socket.emit('receive my room',{room: Object.keys(socket.rooms)[0]});
    });

	socket.on('disconnect', function (socket) {
		console.log("DISCONNECTED");
	});
});
