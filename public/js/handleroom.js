var HTTP = '';
var socket = io(HTTP);

socket.on('server-dang-ky-thanh-cong', function(data) {
    $('.form_regis_mem').html("<span class='txt_hello'>Chào bạn <b>" + data + "</b></span><span class='logout' id='logout'>Thoát</span>");
    $('.form_regis_room').show(500);
    $('.box_chat_room').show();

});

socket.on('dang-ky-that-bai', function() {
    $('.validation').html('Đã xảy ra lỗi !');
});

socket.on('cap-nhat-danh-sach-user', function(data) {
    $('.list_mem_ul').html('');
    data.forEach(function(i) {
        $('.list_mem_ul').append("<li clas='userOnline'>" + i + "</li>");
    });
});

socket.on('client-logout-thanh-cong', function() {
    $('.form_regis_mem').html("<input type='text' class='txt_name control_input'" +
        " id='txt_name' placeholder='Nhập họ tên..' />" +
        "<button class='btn_regis btn_regis_name'>Đăng ký</button>");
    $('.form_regis_room').hide(500);
    $('.box_chat_room').hide(500);
});

socket.on('server-typing', function(data) {
    $('.typing_now').html(data);
});

socket.on('server-typing-out', function() {
    $('.typing_now').html('');
});

socket.on('cap-nhat-danh-sach-phong', function(data) {
    $('.list_room_ul').html('');
    data.map(function(r) {
        $('.list_room_ul').append("<li>" + r + "</li>");
    });
});


$(document).ready(function() {
    $('.box_chat_room').hide();
    $('.form_regis_room').hide();
    $('.control_box_room').show();

    $('#txt_name').keyup(function(e) {
        if (e.keyCode == 13) {
            var txt_name = $('#txt_name').val();
            if (txt_name != '') {
                socket.emit('client-dang-ky-mem', txt_name);
                $('#txt_name').val('')
            }
        }
    });
});
$(document).on('click', '.btn_regis_name', function() {
    var txt_name = $('#txt_name').val();
    if (txt_name != '') {
        socket.emit('client-dang-ky-mem', txt_name);
        $('#txt_name').val('')
    }
});
$(document).on('click', '#logout', function() {
    socket.emit('client-logout');
});

$(document).on('focusin', '#txt_message', function() {
    socket.emit('typing-client');
});

$(document).on('focusout', '#txt_message', function() {
    socket.emit('out-typing-client');
});

$(document).on('click', '.create_room', function() {
    ten_room = $('.txt_name_room').val();
    socket.emit('su-kien-tao-room', ten_room);
    $('.txt_name_room').val('');
});