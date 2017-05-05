var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
//   , fs = require('fs')

app.listen(process.env.PORT || 3000);
function handler (req, res) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }
    res.writeHead(200);
    res.end(data);
}

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
        // console.log(io.nsps['/'].adapter.rooms[msg.roomName].messages)
        if (typeof io.nsps['/'].adapter.rooms[msg.roomName].messages === 'undefined') {
            io.nsps['/'].adapter.rooms[msg.roomName].messages = [];
        }
    });

    socket.on('request my room', function (msg) {
        socket.emit('receive my room',{room: Object.keys(socket.rooms)[0]});
    });

    socket.on('send message', function (msg) {
        let username = socket.id;
        let roomName = Object.keys(socket.rooms)[0];
        if (socket.username) {
            username = socket.username;
        }
        console.log("MESSAGE TO ROOM: ", roomName)
        io.nsps['/'].adapter.rooms[roomName].messages.push('<b>' + username + '</b>: ' + msg.msg + '<br />');
        socket.broadcast.to(Object.keys(socket.rooms)[0]).emit('broadcast message', {msg: msg.msg, user: username});
        socket.emit('broadcast message', {msg: msg.msg, user: username});
    });

    socket.on('get username', function () {
        let username = socket.id;
        if (socket.username) {
            username = socket.username;
        }
        socket.emit('receive username', {username: username});
    });

    socket.on('change username', function (msg) {
        socket.username = msg.username;
    });

    socket.on('get chat history', function () {
        socket.emit('receive chat history', {chat: io.nsps['/'].adapter.rooms[Object.keys(socket.rooms)[0]].messages})
    });

	socket.on('disconnect', function (socket) {
		console.log("DISCONNECTED");
	});
});
