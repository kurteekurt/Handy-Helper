
document.addEventListener('DOMContentLoaded', function () {

    const form = document.getElementById('createjobForm');
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Fetch the form data
        const formData = new FormData(form);

        // Perform client-side validation
        if (validateForm(formData)) {
            // If validation passes, you can send the data to the server using AJAX or fetch API
            sendFormData(formData);
        } else {
            // Display error messages or take appropriate action
            console.log('Form validation failed');
        }
    });
});

function validateForm(formData) {
    if (username === '') {
        isValid = false;
        alert('Please enter a username.');

        if (VolTitle.value === '') {
            isValid = false;
            alert('Please enter a title.');

        }

        if (VoluPho.files.length === 0) {
            isValid = false;
            alert('Please select a photo.');

        }

        if (descript.value === '') {
            isValid = false;
            alert('Please enter a description.');

        }

        if (street.value === '') {
            isValid = false;
            alert('Please enter a street.');

        }

        if (city.value === '') {
            isValid = false;
            alert('Please enter a city.');

        }

        if (District.value === 'placeholder') {
            isValid = false;
            alert('Please select a district.');

        }

        if (zipcode.value === '' || zipcode.value.length !== 5) {
            isValid = false;
            alert('Please enter a valid zip code.');

        }

        return isValid;

    }
}
return true;


function sendFormData(formData) {
    fetch('/api/jobs/submit', {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Form submission successful:', data);
            
        })
        .catch(error => {
            console.error('Error submitting form:', error);
            // Handle errors, display a message, etc.
        });
}