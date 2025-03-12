document.addEventListener('DOMContentLoaded', function() {
    const orgName = extractOrgNameFromURL();
    fetchOrganizationData(orgName);
    console.log(orgName);
});

function extractOrgNameFromURL() {
    const pathArray = window.location.pathname.split('/');
    const orgNameIndex = pathArray.indexOf('organization') + 1;
    return decodeURIComponent(pathArray[orgNameIndex]); // Decode URI component
}

function fetchOrganizationData(orgName) {
    fetch(`/api/organizationData/${orgName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => populateTemplateWithData(data))
        .catch(error => console.error('Error fetching organization data:', error));
}

function populateTemplateWithData(data) {
    console.log(data);

    document.getElementById('org-name').textContent = data.orgName;
    console.log(data.name);
    document.getElementById('org-description').textContent = data.description;
    console.log(data.description);

    document.getElementById('org-logo').src = `/uploads/${data.logo}`;

    //document.getElementById('org-volunteer-link').href = data.volunteerLink; // TODO
    document.getElementById('org-location').textContent = `${data.street}, ${data.city}, ${data.state}, ${data.zipCode}`;
    document.getElementById('org-contact-name').textContent = data.contactName;
    document.getElementById('org-contact-phone').textContent = data.phone_number;
    document.getElementById('org-contact-email').href = `mailto:${data.email}`;
    document.getElementById('org-contact-email').textContent = data.email;
    document.getElementById('org-website').href = data.website;
    document.getElementById('org-website').textContent = data.website;
}

function constructLogoUrl(filename) {
    // Use relative URL for flexibility
    return `/uploads/${filename}`;
}
