/* TODO:
    - Debugging, if any
*/

$(document).ready(function() {
    $("#registration-form").on('submit', async function(event){
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();
        var cpassword = $("#password1").val();
        var formError = $("#form-error");
        //var isValid = true;

        formError.text(''); //ensures form-error text content is empty
        
        //email and password validation
        var reg = /^[a-zA-Z0-9._%+-]+@dlsu\.edu\.ph$/;
        if (!reg.test(email)) {
            return formError.text('Please enter a valid email.'); 
            //isValid = false;
        }

        if (password.length < 6) {
            return alert('Password should be AT LEAST 6 characters');
            //isValid = false;
        }

        if (cpassword !== password) {
            return alert('Passwords DO NOT match!');
            //isValid = false;
        }


        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.trim(), 
                    password: password.value.trim() 
                }),
                
            });
    
                
            if (!response.ok) {
                throw new Error('Failed to Register.');
            }
    
            const result = await response.text(); 
            alert(result); 
    
        } catch (error) {
            formError.text(await response.text());
        }
        

    });


});