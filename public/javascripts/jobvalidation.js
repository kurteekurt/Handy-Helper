function validatePost(event, validate) {
    if (validate && !validateForm()) {
        event.preventDefault();
    }


function validatePost() {
    if (validate && !validateForm()) {
        event.preventDefault();
    }
    var VoluTitle = document.getElementById('Post Title').value;
    var VoluPho = document.getElementById('VolPho').value;
    var descript = document.getElementById('description').value;
    var streetAdd = document.getElementById('street').value;
    var cityAdd = document.getElementById('city').value;
    

    if(VoluTitle.length <2){
    alert("You need a longer Title");
    }
    if(descript.length < 30){
    alert("Write what kind of volunteer work your organization is looking for");
    }
    if(streetAdd == ""){
        window.alert("Please Enter your Street Address");
        streetAdd.focus() ;
        return false;
    }
    if(cityAdd == ""){
        window.alert("Please Enter your City Address");
        City.focus() ;
        return false;
    }

    if (zipcode !== "/(^\d{5}(-\d{4})?$/");{
        window.alert("Please Enter a Valid Zipcode");
        zipcode.focus();
        return false;

    }  
    
}
    return true;

}
