
document.querySelector('.search-btn').addEventListener('click', async function() {
    const locationInput = document.querySelector('.location-input').value;
    const distance = document.querySelector('.distance-dropdown').value;

    try {

        const response = await fetch(`/api/geocode?address=${encodeURIComponent(locationInput)}`);
        const { latitude, longitude } = await response.json();

        if (latitude && longitude) {

            fetchNearbyOrganizations(latitude, longitude, distance);
        } else {
            console.error('Unable to find location');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});


async function fetchNearbyOrganizations(lat, lon, distance) {
    try {
        const response = await fetch(`/api/organizations/nearby?lat=${lat}&lon=${lon}&distance=${distance}`);
        const organizations = await response.json();

        const container = document.getElementById('cards-container');
        container.innerHTML = '';

        organizations.forEach(org => {
            console.log(org);
            const card = createOrganizationCard(org);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching nearby organizations:', error);
    }
}



async function fetchAndDisplayOrganizations() {
    try {
        const response = await fetch('/api/organizations');
        console.log(response);
        const organizations = await response.json();
        console.log(organizations);

        const container = document.getElementById('cards-container');

        organizations.forEach(org => {
            console.log(org);
            const card = createOrganizationCard(org);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Error fetching organizations:', error);
    }
}



function createOrganizationCard(org) {

    const card = document.createElement('div');
    card.className = 'card';


    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    const logo = document.createElement('img');
    logo.src = `/uploads/${org.logo}`;
    logo.alt = `${org.name} Logo`;
    imageContainer.appendChild(logo);


    const contentContainer = document.createElement('div');
    contentContainer.className = 'content-container';


    const titleLink = document.createElement('a');
    titleLink.className = 'content-title';
    titleLink.href = `/organization/${(org.name)}`;
    titleLink.textContent = org.name;


    const descriptionContainer = document.createElement('div');
    descriptionContainer.className = 'content-description';
    const description = document.createElement('p');
    description.textContent = org.description;
    descriptionContainer.appendChild(description);


    card.appendChild(imageContainer);
    card.appendChild(contentContainer);
    contentContainer.appendChild(titleLink);
    contentContainer.appendChild(descriptionContainer);

    return card;
}


document.addEventListener('DOMContentLoaded', fetchAndDisplayOrganizations);
