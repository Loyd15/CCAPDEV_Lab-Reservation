$(document).ready(function() {
    $("#registration-form").on('submit', function(event){
        event.preventDefault();

        var email = $("#email").val();
        var password = $("#password").len();
        var formError = $("#form-error");
        //var isValid = true;

        var formError = ""; //ensures form-error text content is empty
        
        //email and password validation
        var reg = /^[a-zA-Z0-9._%+-]+@dlsu\.edu\.ph$/;
        if (!reg.test(email)) {
            return formError.text('Please enter a valid email.'); 
            //isValid = false;
        }

        if (pwd < 6) {
            alert('Password should be AT LEAST 6 characters');
            //isValid = false;
        }


        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email.value.trim(), 
                    password: password.value.trim() 
                }),
                
            });
    
            
        // TODO 2.2: If successful, display either `Created New Account` or `Updated Existing Account` in an alert message then refresh the page.
    
            if (!response.ok) {
                throw new Error('Failed to login.');
            }
    
            const result = await response.text(); // Assuming the server responds with text
            alert(result); // Display success message
    
        // Optionally, refresh the page after success
        // window.location.reload();
        } catch (error) {
            formError.textContent = await response.text();
        
        

    });


});