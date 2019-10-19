var socket = io('https://chasoc.herokuapp.com');

socket.on('server-send-mesage', function(data) {
    $('#messages').append("<li  class='you'><div class='name'>" + data.un + "</div><div class='noidung'>" + data.nd + "</div></li>");
});
socket.on('server-send-mesage-to-me', function(data) {
    $('#messages').append("<li class='me'><div class='noidung'>" + data.nd + "</div></li>");
});

socket.on('chat-mesage-to-server-chat', function(data) {
    $('#messages').append("<li class='me'>" + data + "</li>");
    // $('#messages').append("<li>" + data.un + " : " + data.nd + "</li>");
});

socket.on('regis-user-that-bai', function() {
    $('#input_message').addClass('error');
});
socket.on('regis-user-thanh-cong', function(data) {
    $('.name_hello span').html(data);
    $('.box_chat').show();
    $('.form_regis').hide(500);
});
socket.on('update-list-users', function(data) {
    $('#list_mem').html('');
    data.forEach(function(i) {
        $('#list_mem').append("<li clas='userOnline'>" + i + "</li>");
    });
});
socket.on('client-logout-thanh-cong', function() {
    $('.form_regis').show();
    $('.input_message').val('');
    $('.box_chat').hide();
});

$('#mes').focusin(function() {
    socket.emit('now-typing-client');
});
socket.on('typing-action-now', function(data) {
    $('.typing_now').append("<div class='now-typing'><span>" + data + "</span></div>");
});
$('#mes').focusout(function() {
    socket.emit('out-typing-client');
});
socket.on('typing-action-out', function(data) {
    $('.typing_now').html('');
});

$(document).ready(function() {
    $('.person_list').show();
    $('.box_chat').hide();

    // $('.mes').bind("enterKey", function(e) {
    //     alert("Enter key pressed");
    // });
    $('.mes').keyup(function(e) {
        if (e.keyCode == 13) {
            var mes = $('#mes').val();
            if (mes != '') {
                socket.emit('client-send-message', mes);
                $('#mes').val('');
            }
        }
    });

    $('.btn_regis').click(function(e) {
        var username = $('#input_message').val();
        if (username != '') {
            socket.emit('client-regis-username', username);
        }
    });

    // $('.action_messa').click(function() {
    //     if ($('#mes').val() != '') {
    //         socket.emit('client-send-message', $('#mes').val());
    //         $('#mes').val('');
    //     }
    // });


    $('.hello_mem_form').submit(function(e) {
        socket.emit('client-logout');
        // $('.form_regis').show();
        // $('.input_message').val('');
        // $('.box_chat').hide();
    });
});