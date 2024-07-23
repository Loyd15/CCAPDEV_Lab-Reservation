/* TODO:
    - Add hashing for passwords
    - Implement 'Remember Me' functionality'
    - Debugging, if any
*/

$(document).ready(function() {
    $("#login-form").on('submit', async function(event){
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#password").val();
        var formError = $("#form-error");
        //var isValid = true;

        formError.text(''); //ensures form-error text content is empty
        
        //email and password validation
        var domain = /@dlsu\.edu\.ph$/;
        if (!domain.test(email)) {
            return formError.text('Please enter a valid email!'); 
            //isValid = false;
        }
        if (email === '' || password === '') {
            return formError.text('Input is missing value(s)!'); 
            //isValid = false;
        }

        try {
            const response = await fetch('/submit-student-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: accountName.value.trim(), 
                    password: password.trim() 
                }),
                
            });
    
            //const result = await response.json();
 
            if (!response.ok) {
                throw new Error('Login Failed.');
            } else {
                window.location.href = 'homepage.html';

            }
            const result = await response.text(); // Assuming the server responds with text
            alert(result); // Display success message

        } catch (error) {
            formError.textContent = await response.text();
        
        }

    });


});