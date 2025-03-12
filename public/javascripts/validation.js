function validateInfo(event, validate) {
    if (validate && !validateForm()) {
        event.preventDefault();
    }
}

function validateForm() {
    var useremail = document.getElementById('email').value;
    var userID = document.getElementById('newUsername').value;
    var age = document.getElementById('birthday').value;
    var createPassword = document.getElementById('newPassword').value;
    var retypePassword = document.getElementById('ReTnewPassword').value;
    var acceptCheckbox = document.getElementById('accept');


    
    if (userID.length < 6) {
        alert("Username must be at least 6 characters long");

    }
    
    // Checking age
    if (/^(0[1-9]|1[0-2])\/(0[1-9]|[1-2][0-9]|3[0-1])\/\d{4}$/.test(age)) {

        var year = age.slice(-4);
        var yearOfBirth = parseInt(year, 10);
        var age = 2023 - yearOfBirth;

        // Check if the person is at least 13 years old
        if (age > 13) {
            
        } 
        else {
            alert('Person is too young. They must be at least 13 years old.');
        }
    }
    else {
        alert('Invalid format. Must follow MM/DD/YYYY');
    
    }   
    

    
    // Checking if password criteria is met
    if (createPassword.length < 8) {
        alert('Password must be at least 8 characters long and contain at least one numeric character.');

    }
    if (/\d/.test(createPassword)) {
        
    } 
    else {
        alert('Password must contain at least one numeric character.');

    }
    if (createPassword !== retypePassword) {
        alert('Passwords do not match.');
        

    }

    // Check if the terms and conditions checkbox is checked
    if (!acceptCheckbox.checked) {
        alert('Please accept the terms and conditions.');
        return false;
    }

    return true;
}

