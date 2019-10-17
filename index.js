var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    // res.send('<h1>Xin Chao</h1>');
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
    console.log('Có một kết nối');
    socket.on('disconnect', function() {
        console.log('Có một kết nối đã ngắt');
    });
});

io.on('connection', function(socket) {
    socket.on('chat-mesage', function(msg) {
        // console.log(msg);
        io.emit('chat-mesage', msg)
    });
})

http.listen(3000, function() {
    console.log('Listening on *:' + port);
});