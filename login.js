document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("login-form").addEventListener("submit", async function(event) {
        event.preventDefault();


        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();
        const rememberMe = document.getElementById("rememberMe").checked ? 1 : 0;
        const formError = document.getElementById("form-error");
        
        formError.textContent = ''; // Ensure form-error text content is empty

        var domain = /@dlsu\.edu\.ph$/;
        if (!domain.test(email)) { 
            errors.push('Please enter a valid DLSU Email!');
          
        }

        if (email === '' || password === '') {
            errors.push('Input is missing value(s)!'); 
        }


        fetch('/login?' + new URLSearchParams({
            email: email,
            password: password,    
            rememberMe: rememberMe
        }), {method: 'GET'})
            .then(res => res.json())
            .then(data => {
                if(data.status == "success") {
                    formError.textContent = '';
                    if(data.role == "technician") {
                        
                        redirectTechnician();
                    }
                    else if(data.role == 'student') {
                        redirectStudent();
                    }
                }
                else {
                    formError.innerHTML = "Wrong login information!";
                }
            })
    });
});

function redirectStudent() {
    window.location.href = '/homepage-student';
}

function redirectTechnician() {
    window.location.href = '/homepage-technician';
}



