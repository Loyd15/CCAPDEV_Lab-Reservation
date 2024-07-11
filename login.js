$(document).ready(function() {
    $("#login-form").on('submit', function(event){
        event.preventDefault();

        let email = $("#email").val();
        let pwd = $("#password").val();
        let isValid = true;

        if (!email || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            alert('Please enter a valid email.'); //might change later on//
            isValid = false;
        }

        if (!password) {
            alert('Please enter your password.');
            isValid = false;
        }

        //Other server-side stuff will be for MCO3

    });


});