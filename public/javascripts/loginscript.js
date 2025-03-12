document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('signupform');

    form.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(form);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        const username = formData.get('username');
        const email = formData.get('email');

        // Check if the username is already taken
        checkUsernameAvailability(username)
            .then(usernameAvailable => {
                if (!usernameAvailable) {
                    alert('Username is already taken. Please choose a different username.');
                } else {
                    // Check if the email is already taken
                    checkEmailAvailability(email)
                        .then(emailAvailable => {
                            if (!emailAvailable) {
                                alert('Email is already taken. Please use a different email.');
                            } else {
                                // If both username and email are available, go ahead with registration
                                fetch('/api/register/user', {
                                    method: 'POST',
                                    body: formData
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('Success:', data);
                                        setLoggedInUsername(username);
                                        localStorage.setItem('isLoggedIn', 'true');
                                        window.location.href = "index.html"; // Redirect to a welcome page or similar
                                    })
                                    .catch((error) => {
                                        console.error('Error:', error);
                                    });
                            }
                        })
                        .catch(error => {
                            console.error('Error checking email availability:', error);
                        });
                }
            })
            .catch(error => {
                console.error('Error checking username availability:', error);
            });
    });
});

function checkUsernameAvailability(username) {
    return fetch(`/api/check-username?username=${encodeURIComponent(username)}`)
        .then(response => response.json())
        .then(data => {
            return data.available;
        })
        .catch(error => {
            console.error('Error checking username availability:', error);
            return false;
        });
}

function checkEmailAvailability(email) {
    return fetch(`/api/check-email?email=${encodeURIComponent(email)}`)
        .then(response => response.json())
        .then(data => {
            return data.available;
        })
        .catch(error => {
            console.error('Error checking email availability:', error);
            return false;
        });
}

    

function loadHeader(){
    var header = document.getElementsByClassName("header")[0];

    var xhr = new XMLHttpRequest();

    xhr.open('GET', '/header.html', true);

    xhr.onload = function(){
        if(xhr.status >= 200 && xhr.status < 300){
            header.innerHTML = xhr.responseText;
            updateNavigationBar();
        }
        else{
            console.log("Failed to load header");
        }
    };
    xhr.send();
}

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginform');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        var formData = new FormData(loginForm);
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        username = formData.get('username');

        fetch('/api/login', {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                if (data.success) {

                    setLoggedInUsername(username);
                    localStorage.setItem('isLoggedIn', 'true');
                    alert('Login Successful!');
                    window.location.href = "index.html";
                } else {
                    // Handle login failure

                    alert('Invalid Credentials');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred during login.');
            });
    });
});

function isUserLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
}

function updateNavigationBar() {
    var navbar = document.getElementsByClassName("header")[0];

    if (isUserLoggedIn()) {
        var loggedInUsername = getLoggedInUsername();
        navbar.innerHTML = `
        <link href="css/dropmenu.css" rel="stylesheet"/>
        <header class="header">
            <img alt="Company Logo" class="logo"
             src="/assets/handy-helper-low-resolution-logo-color-on-transparent-background.png">
        <div class="header-right">
            <a class="home" href="/index.html">Home</a>
            <a class="organizations" href="/organizations.html">Organizations</a>
            <a class="aboutus" href="/aboutus.html" target>About Us</a>
            <a class="contactus" href="/faq.html" target>FAQ</a>
            <div class="dropdown">
                <button class="dropbtn">Welcome, ${loggedInUsername}</button>
                <div class="dropdown-content" id="userDropdownContent">
                    <div class="menu">
                        <br>
                        <a id="logoutButton" href="#"> Logout</a>
                            
                        
                    </div>
                </div>
            </div>
            
        </div>
    </header>
        `;

    document.getElementById("logoutButton").addEventListener("click", logout);
    var dropdownButton = document.querySelector('.dropbtn');
    dropdownButton.addEventListener('click', toggleDropdown);
    } else {
        navbar.innerHTML = `
        <header class="header" id="header">
        <img alt="Company Logo" class="logo"
             src="/assets/handy-helper-low-resolution-logo-color-on-transparent-background.png">
        <div class="header-right">
            <a class="home" href="/index.html">Home</a>
            <a class="organizations" href="/organizations.html">Organizations</a>
            <a class="aboutus" href="/aboutus.html" target>About Us</a>
            <a class="contactus" href="/faq.html" target>FAQ</a>
            <a class="login" href="/login.html" target>Sign In/Sign Up</a>
        </div>
    </header>
        `;
    }
}

function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loggedInUsername');
    alert('Logout successful!');
    window.location.href = 'index.html';
}

function setLoggedInUsername(username) {
    localStorage.setItem('loggedInUsername', username);
}

function getLoggedInUsername() {
    return localStorage.getItem('loggedInUsername');
}

function toggleDropdown() {
    var dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = (dropdownContent.style.display === 'block') ? 'none' : 'block';
}

window.onload = loadHeader;
window.onload = updateNavigationBar;
var prevScrollpos = window.pageYOffset;

window.onscroll = function () {
    var currentScrollPos = window.pageYOffset;

    if (prevScrollpos > currentScrollPos) {
        
        document.getElementById("userDropdownContent").style.display = "none";
    } else {
        
        document.getElementById("userDropdownContent").style.display = "none";
    }

    prevScrollpos = currentScrollPos;
    };
