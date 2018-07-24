window.onload = main;

function main() {
    console.log("loaded");
    event_bind();
}

function event_bind() {
    var interval;
    $("#increase").on('mousedown', function (e) {
        interval = setInterval(function () {
            increase();
        }, 100);
    });
    $("#increase").on('mouseup', function (e) {
        clearInterval(interval);
    });
    $("#increase").on('mouseout', function (e) {
        clearInterval(interval);
    });
}

function increase() {
    var amount = parseInt($('#amount').val()) || 0;
    amount += 10;
    tokenBalance = amount;
    console.log(tokenBalance);
    $('#amount').val(tokenBalance);
}


function showPassword() {
    var pwd = document.getElementById("password");
    if (pwd.type == "password") {
        pwd.type = "text";
    } else {
        pwd.type = "password";
    }
}