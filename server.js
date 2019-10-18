var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");


app.get('/', function (req, res) {
    res.render('trangchu');
});
app.get('/bai1', function (req, res) {
    res.render('bai1');
});
var danhsachUsers = [];

io.on('connection', function (socket) {
    console.log('Có một kết nối:' + socket.id);
    socket.on('disconnect', function () {
        console.log(socket.id + 'đã ngắt kết nối');
    });
    socket.on('chat-mesage-to-client', function (data) {
        // console.log();
        // socket.emit('chat-mesage-to-server', data); // A gửi lên và SV chỉ gửi về A
        // socket.broadcast.emit('chat-mesage-to-server', data);// Chat đến người khác nhưng không gửi về mình
        io.sockets.emit('chat-mesage-to-server', data);
    });
    socket.on('client-regis-username', function (data) {
        if (danhsachUsers.indexOf(data) >= 0) {
            socket.emit('regis-user-that-bai');
        } else {
            // SUSSCES
            danhsachUsers.push(data);
            socket.Username = data;
            socket.emit('regis-user-thanh-cong', data);
        }
    });




});