document.addEventListener("DOMContentLoaded", () => {

    // const registerForm = document.getElementById('registration-form');
    // const registerStudentBtn = document.getElementById("register-student");
    // const registerTechnicianBtn = document.getElementById("register-technician");
    const formError = document.getElementById("form-error");

    document.getElementById("register-student").addEventListener("click", () => inputValidation(false));
    document.getElementById("register-technician").addEventListener("click", () => inputValidation(true));

    //Handles client-side registration
    function inputValidation(isTechnician) {
        formError.textContent = '';
        const email = document.getElementById("email").value;
        const name = document.getElementById("name").value;
        const password = document.getElementById("password").value;
        const cpassword = document.getElementById("password1").value;
        const errors = [];
    

        if (email === '' || name === '' || password === '' || cpassword === '') {
            errors.push('Input is missing value(s)!');
        }

        const reg = /^[a-zA-Z0-9._%+-]+@dlsu\.edu\.ph$/;
        if (!reg.test(email)) {
            errors.push('Please enter a valid DLSU email.');
        }

        if (password.length < 6) {
            errors.push('Password should be AT LEAST 6 characters');
        }

        if (cpassword != password) {
            errors.push('Passwords DO NOT match!');
        }

        if (errors.length > 0) {
            formError.textContent = errors.join('<br>');
            return;
        }

        const formData = new FormData();
        formData.append('email', email);
        formData.append('name', name);
        formData.append('password', password);

        checkUser(email, isTechnician, formData);


    }

    function checkUser(email, isTechnician, formData) {
        fetch('/email?email=' + encodeURIComponent(email), { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length !== 0) {
                    formError.innerHTML = "Account already Exists!";
                } else {
                    if (isTechnician) {
                        checkTechnician(email, formData);
                    } else {
                        formError.textContent = '';
                        registerStudent(formData);
                    }
                }
            })
            .catch(error => {
                console.error("Error in checkUser:", error);
                formError.innerHTML = "A Server Error Occurred!";
            });
    
    }

    function checkTechnician(email, formData) {
        fetch('/email/technician?email=' + encodeURIComponent(email), { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (Object.keys(data).length !== 0) {
                    formError.innerHTML = "Technician already Exists!";
                } else {
                    formError.textContent = '';
                    registerTechnician(formData);
                }
            })
            .catch(error => {
                console.error("Error in checkUser:", error);
                formError.innerHTML = "A Server Error Occurred!";
            });
    
    }

    function registerStudent(formData) {
        const data = new URLSearchParams(formData);
        console.log('FormData:', formData);
        console.log('URLSearchParams:', data.toString());

        fetch('/register/student', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url; // Handle redirect
            } else {
                return response.text(); // Handle text response
            }
        })
        .then(result => alert(result))
        .catch(error => formError.textContent = error.message);
    }

    function registerTechnician(formData) {
        const data = new URLSearchParams(formData);

        fetch('/register/technician', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: data
        })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url; // Handle redirect
            } else {
                return response.text(); // Handle text response
            }
        })
        .then(result => alert(result))
        .catch(error => formError.textContent = error.message);
        
    }



    // });

        // registerForm.addEventListener('submit', (event) => {
        //     event.preventDefault();
        
        //     const formData = new FormData(registerForm);
        
        //     fetch('/register.js', {
        //         method: 'POST',
        //         body: formData
        //     })
        //     .then(response => {
        //         if (!response.ok) {
        //             throw new Error('Failed to Register.');
        //         }
        //         return response.text();
        //     })
        //     .then(result => {
        //         alert(result);
        //     })
        //     .catch(error => {
        //         formError.textContent = error.message;
        //     });
        // });
});