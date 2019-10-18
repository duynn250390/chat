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

$(document).ready(function () {
    var socket = io();
    $('.person_list').show();
    $('.box_chat').hide();
    $('#formID_regis').submit(function (e) {
        var username = $('#input_message').val();
        if (username != '') {
            socket.emit('client-regis-username', username);
        }
    });
    socket.on('regis-user-that-bai', function () {
        $('#input_message').addClass('error');
    });
    socket.on('regis-user-thanh-cong', function (data) {
        $('.name_hello span').html(data);
        $('.box_chat').show();
        $('.form_regis').hide(500);
    });
});