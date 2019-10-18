$(function () {
    var socket = io();
    $('form').submit(function (e) {
        e.preventDefault();
        if ($('#mes').val() != '') {
            socket.emit('chat-mesage-to-client', $('#mes').val());
            $('#mes').val('');
            return false;
        }
    });
    socket.on('chat-mesage-to-server', function (data) {
        $('#messages').append($('<li>').text(data));
        window.scrollTo(0, document.body.scrollHeight);
    });
});