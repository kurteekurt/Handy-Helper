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
                    console.log('Username is available.');
                    // Check if the email is already taken
                    console.log('Checking email availability...');
                    checkEmailAvailability(email)
                        .then(emailAvailable => {
                            if (!emailAvailable) {
                                alert('Email is already taken. Please use a different email.');
                            } else {
                                // If both username and email are available, go ahead with registration
                                fetch('/api/register/organization', {
                                    method: 'POST',
                                    body: formData
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('Success:', data);
                                        setLoggedInUsername(username);
                                        localStorage.setItem('isLoggedIn', 'true');
                                        window.location.href = '/organizations.html'; // Redirect to a welcome page or similar
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

function setLoggedInUsername(username) {
    localStorage.setItem('loggedInUsername', username);
}