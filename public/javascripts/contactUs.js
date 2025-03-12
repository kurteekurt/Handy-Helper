const form = document.querySelector('form');
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const contactNumber = document.getElementById("contactNumber");
const message = document.getElementById("message");


function sendInquiry() {

    const bodyMessage = 'Contact Name: ${contactName.value}<br> Email: ${email.value}<br> Phone Number: ${contactNumber.value}<br><br> Message: ${message.value}';

    Email.send({
        Host : "smtp.elasticemail.com",
        Username : "dapapichuloz@gmail.com",
        Password : "26C3D6A7104F8EBEAD9AD1E4995E3D8B08D9",
        To : 'dapapichuloz@gmail.com',
        From : "dapapichuloz@gmail.com",
        Subject : "New Inquiry: Someone wants to know more!",
        Body : "Contact Name: " + document.getElementById("contactName").value
                + "<br> Email: " + document.getElementById("contactEmail").value
                + "<br> Phone Number : " + document.getElementById("contactNumber").value
                + "<br><br> Message: " + "<br><br>" + document.getElementById("message").value
    
    
    
    }).then(
      message => {
        if (message == "OK")
            alert("Your message has been succesfully sent!")
      }
    );

}

form.addEventListener("submit", (e) => {

    e.preventDefault();

    if (validateForm()) {
      sendInquiry();
      document.getElementById("contactUs").reset();
  }

})

function validateForm() {
  var name = document.getElementById("contactName").value;
  var email = document.getElementById("contactEmail").value;
  var phoneNumber = document.getElementById("contactNumber").value;
  var message = document.getElementById("message").value;

  if (name === "" || email === "" || phoneNumber === "" || message === "") {
      alert("Please fill in all fields before submitting the form.");
      return false; // Prevent form submission
  }

  // Add additional validation if needed

  return true; // Allow form submission
}