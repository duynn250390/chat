// socket.emit('chat-mesage-to-server', data); // A gửi lên và SV chỉ gửi về A
// socket.broadcast.emit('chat-mesage-to-server', data);// Chat đến người khác nhưng không gửi về mình
var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
server.listen(port);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");

var danhsachUsers = [];
var danhsachUsersROOM = [];
var listUser = {};
io.on('connection', function(socket) {
    console.log('Có một kết nối:' + socket.id);
    socket.on('disconnect', function() {
        // console.log(socket.id + 'đã ngắt kết nối');
    });

    socket.on('client-regis-username', function(data) {
        if (danhsachUsers.indexOf(data) >= 0) {
            socket.emit('regis-user-that-bai');
        } else {
            danhsachUsers.push(data);
            socket.Username = data;
            socket.emit('regis-user-thanh-cong', data);
            io.sockets.emit('update-list-users', danhsachUsers);
        }
    });

    socket.on('client-logout', function() {
        danhsachUsers.splice(
            danhsachUsers.indexOf(socket.Username), 1
        );
        socket.broadcast.emit('update-list-users', danhsachUsers);
        socket.emit('client-logout-thanh-cong');
    });

    socket.on('send-message-to-client', function(data) {
        console.log(socket.Username, 'Username');
        console.log(data, 'Message');

    });

    socket.on('client-send-message', function(data) {
        socket.emit("server-send-mesage-to-me", { nd: data });
        socket.broadcast.emit("server-send-mesage", { un: socket.Username, nd: data });
    });

    socket.on('now-typing-client', function() {
        var user_typing = socket.Username + " đang gõ chữ";
        socket.broadcast.emit('typing-action-now', user_typing);
    });

    socket.on('out-typing-client', function() {
        socket.broadcast.emit('typing-action-out');
    });
    // =====================CHATROOM================
    socket.on('client-dang-ky-mem', function(data) {

        if (danhsachUsersROOM.indexOf(data) >= 0) {
            socket.emit('dang-ky-that-bai');
        } else {
            danhsachUsersROOM.push(data);
            socket.username = data;

            socket.emit('server-dang-ky-thanh-cong', data);
            io.sockets.emit('cap-nhat-danh-sach-user', danhsachUsersROOM);

            var mangRoom = [];
            for (r in socket.adapter.rooms) {
                mangRoom.push(r);
            }
            io.sockets.emit('cap-nhat-danh-sach-phong', mangRoom);

        }
    });

    socket.on('client-logout', function() {
        danhsachUsersROOM.splice(
            danhsachUsersROOM.indexOf(socket.Username), 1
        );

        socket.broadcast.emit('cap-nhat-danh-sach-user', danhsachUsersROOM);
        socket.emit('client-logout-thanh-cong');

        var mangRoom = [];
        for (r in socket.adapter.rooms) {
            mangRoom.push(r);
        }
        io.sockets.emit('cap-nhat-danh-sach-phong', mangRoom);
    });

    socket.on('typing-client', function() {
        var typing_now = "<span class='name'>" + socket.username + "</span>đang nhập ...";
        socket.broadcast.emit('server-typing', typing_now)
    });

    socket.on('out-typing-client', function() {
        socket.broadcast.emit('server-typing-out')
    });

    socket.on('su-kien-tao-room', function(data) {
        socket.join(data);
        socket.phong = data;
        console.log(socket.adapter.rooms);
        var mangRoom = [];
        for (r in socket.adapter.rooms) {
            mangRoom.push(r);
        }
        io.sockets.emit('cap-nhat-danh-sach-phong', mangRoom);
    });

});

app.get('/', function(req, res) {
    res.render('trangchu');
});
app.get('/bai1', function(req, res) {
    res.render('bai1');
});

app.get('/chatroom', function(req, res) {
    res.render('chatroom');
});