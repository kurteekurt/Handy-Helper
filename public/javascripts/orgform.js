function submitForm(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var reenterpassword = document.getElementById("reenterpassword").value;
    var logo = document.getElementById("logo").value;
    var organizationName = document.getElementById("organizationName").value;
    var description = document.getElementById("description").value;
    var  address= document.getElementById("address").value;
    var zipcode = document.getElementById("zipcode").value;
    var city = document.getElementById("city").value;
    var state = document.getElementById("state").vaue;
    var phone = document.getElementById("phonenumber").value;
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var website = document.getElementById("website").value;

    if(password !== reenterpassword){
        alert('Passwords do not match');
        return;
    }

    console.log("Username:", username);
    console.log("Password:", password);
    console.log("Logo:", logo);
    console.log("Organization Name:", organizationName);
    console.log("Description:", description);
    console.log("Address:", address);
    console.log("Zip Code:", zipcode);
    console.log("City:", city);
    console.log("State:", state);
    console.log("Phone:", phone);
    console.log("Email:", email);
    console.log("Website:", website);

    alert("Signup successful!");
}