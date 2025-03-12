


// Server Startup Message
const message = 'CSC-317 startup template\n' + 'This template uses nodeJS, express, and express.static\n';

// Setting the port for the server
const port = 3000;

// Import modules
const path = require('path');
const express = require('express');
const app = express();
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcrypt');


// Setting up the directory to serve static files
const StaticDirectory = path.join(__dirname, 'public');
app.use(express.static(StaticDirectory));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));



// Importing axios for HTTP requests
const axios = require('axios');
// Configuring multer for file uploads
const upload = multer({ dest: 'public/uploads/' });



// Database connection
// Import mysql module
const mysql = require('mysql');
// Setup database connection parameter
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'student',
    password: 'student',
    database: 'handyhelper'
});
// Connect with the database
connection.connect(err => {
    if (err) throw err;
    console.log("Connected to the MySQL server.");
});






function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Radius of the Earth in miles
    const rlat1 = Math.PI * lat1 / 180; // Convert degrees to radians
    const rlat2 = Math.PI * lat2 / 180; // Convert degrees to radians
    const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    const difflon = Math.PI * (lon2 - lon1) / 180; // Radian difference (longitudes)

    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return d;
}


// Function to geocode an address using an external API
async function geocodeAddress(address) {
    // Encode the address to be used in the URL
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(address)}`;

    // Make the request to the API
    try {
        // Wait for the response
        const response = await axios.get(url);
        // Get the data from the response
        const data = response.data;

        // Check if there are any results
        if (data && data.length > 0) {
            // Return the latitude and longitude
            return {
                latitude: data[0].lat, longitude: data[0].lon
            };
        } else {
            return { error: "No results found" };
        }
        // Catch any errors
    } catch (error) {
        return { error: error.message };
    }
}


// Define the Organization, Event, and User classes
class Address {
    // Constructor
    constructor(street, city, state, zipCode, latitude = null, longitude = null) {
        this.street = street;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Method to update latitude and longitude
    setCoordinates(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    // Method to convert address to string
    toString() {
        return `${this.street}, ${this.city}, ${this.state}, ${this.zipCode}`;
    }
}


class OrganizationContact {
    constructor(name, phonenumber, email, website) {
        this.name = name;
        this.phonenumber = phonenumber;
        this.email = email;
        this.website = website;
    }
}

class Organization {

    constructor(user, logo, name, description, address, contact) {
        this.user = user;  // User object
        this.logo = logo;
        this.name = name;
        this.description = description;
        this.address = address;
        this.contact = contact;
        this.events = [];
    }


    // Method to add an event to the organization
    addEvent(event) {
        this.events.push(event);
    }

    // Method to update the geocode of the address
    async updateAddressGeocode() {
        // Check if the address exists
        if (this.address) {
            // Geocode the address
            const geocodedData = await geocodeAddress(this.address.toString());
            // Check if there was an error
            if (!geocodedData.error) {
                this.address.setCoordinates(geocodedData.latitude, geocodedData.longitude);
            }
        }
    }
}


class Event {
    constructor(name, description, location) {
        this.name = name;
        this.description = description;
        this.location = location;
    }
}

class User {
    constructor(username, password, email, dob) {
        this.username = username;
        this.password = password;
        this.email = email;
        this.dob = dob;
    }
}


//let users = []; // Temporary storage for user data
//let organizations = []; // Temporary storage for organization data


// API Endpoints


// Register an Organization
app.post('/api/register/organization', upload.single('logo'), async (req, res) => {
    console.log(req.body);
    const {
        username, password, email, dob,
        organizationName, description, street, city, state, zipcode, website, name, phonenumber, contactEmail
    } = req.body;

    // Hash the password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async function (err, hashedPassword) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Create the User object with hashed password
        const user = new User(username, hashedPassword, email, dob);

        // Create the Address and Contact objects
        const address = new Address(street, city, state, zipcode);
        const contact = new OrganizationContact(name, phonenumber, contactEmail, website);

        // Create the Organization object with the user
        const organization = new Organization(user, req.file, organizationName, description, address, contact);

        // Update geocode
        await organization.updateAddressGeocode();

        // Insert data into MySQL database
        const insertUser = 'INSERT INTO Users (username, password, email, dob) VALUES (?, ?, ?, ?)';
        const insertAddress = 'INSERT INTO Addresses (street, city, state, zipcode, latitude, longitude) VALUES (?, ?, ?, ?, ?, ?)';
        const insertOrganization = 'INSERT INTO Organizations (user_id, name, description, logo, address_id) VALUES (?, ?, ?, ?, ?)';
        const insertContact = 'INSERT INTO OrganizationContacts (organization_id, name, phone_number, email, website) VALUES (?, ?, ?, ?, ?)';

        connection.query(insertUser, [username, hashedPassword, email, dob], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            const userId = results.insertId;

            connection.query(insertAddress, [street, city, state, zipcode, organization.address.latitude, organization.address.longitude], (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: err.message });
                }
                const addressId = results.insertId;

                connection.query(insertOrganization, [userId, organizationName, description, req.file.filename, addressId], (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ error: err.message });
                    }
                    const organizationId = results.insertId;

                    connection.query(insertContact, [organizationId, name, phonenumber, contactEmail, website], (err, results) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({ error: err.message });
                        }

                        console.log(`Organization registered successfully with id ${organizationId}`);
                        res.status(200).json({ message: "Organization registered successfully", organizationId });
                    });
                });
            });
        });
    });
});

// Check Organization Username Availability 
app.get('/api/check-org-username', (req, res) => {
    const orgUsername = req.query.orgUsername;

    if (!orgUsername) {
        return res.status(400).json({ message: 'Organization username is required' });
    }

    const query = 'SELECT COUNT(*) AS count FROM Organizations WHERE orgUsername = ?';

    connection.query(query, [orgUsername], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results[0].count > 0) {
            // Organization username is taken
            res.json({ isAvailable: false });
        } else {
            // Organization username is available
            res.json({ isAvailable: true });
        }
    });
});

// Check Organization Email Availability
app.get('/api/check-org-email', (req, res) => {
    const orgEmail = req.query.orgEmail;

    if (!orgEmail) {
        return res.status(400).json({ message: 'Organization email is required' });
    }

    const query = 'SELECT COUNT(*) AS count FROM Organizations WHERE orgEmail = ?';

    connection.query(query, [orgEmail], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results[0].count > 0) {
            // Organization email is taken
            res.json({ isAvailable: false });
        } else {
            // Organization email is available
            res.json({ isAvailable: true });
        }
    });
});


// Register a User
app.post('/api/register/user', upload.none(), async (req, res) => {
    console.log(req.body);
    // Extract data from the request
    const { username, password, email, dob } = req.body;

    // Hash the password
    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ error: 'Error hashing password' });
        }

        // Use the hashed password for storing in the database
        const parts = dob.split('/');
        const convertedDob = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        const insertUser = 'INSERT INTO Users (username, password, email, dob) VALUES (?, ?, ?, ?)';

        connection.query(insertUser, [username, hash, email, convertedDob], (err, results) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: err.message });
            }
            const userId = results.insertId;
            console.log(`User registered successfully with id ${userId}`);
            res.status(200).json({ message: "User registered successfully", userId });
        });
    });
});



app.post('/api/login', upload.none(), (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    // Query the database to retrieve the user by username
    connection.query('SELECT * FROM Users WHERE username = ?', [username], (error, results) => {
        if (error) {
            console.error('Error:', error);
            return res.status(500).json({ success: false, message: 'Internal Server Error' });
        }

        if (results.length > 0) {
            // Compare the hashed password
            bcrypt.compare(password, results[0].password, function (err, result) {
                if (err) {
                    console.error('Error comparing password:', err);
                    return res.status(500).json({ success: false, message: 'Internal Server Error' });
                }

                if (result) {
                    // User authentication successful
                    res.json({ success: true });
                } else {
                    // User authentication failed
                    res.json({ success: false, message: 'Invalid Credentials' });
                }
            });
        } else {
            // No user found with that username
            res.json({ success: false, message: 'Invalid Credentials' });
        }
    });
});

app.get('/api/check-username', (req, res) => {
    const username = req.query.username;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    const query = 'SELECT COUNT(*) AS count FROM Users WHERE username = ?';

    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results[0].count > 0) {
            // Username is taken
            res.json({ available: false });
        } else {
            // Username is available
            res.json({ available: true });
        }
    });
});

app.get('/api/check-email', (req, res) => {
    const email = req.query.email;
    console.log(email);

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const query = 'SELECT COUNT(*) AS count FROM Users WHERE email = ?';

    connection.query(query, [email], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (results[0].count > 0) {
            // Email is taken
            console.log('Email is taken');
            res.json({ available: false });
        } else {
            // Email is available
            console.log('Email is available');
            res.json({ available: true });
        }
    });
});


// API endpoint to get all organizations
app.get('/api/organizations', (req, res) => {
    const query = 'SELECT * FROM Organizations';

    connection.query(query, (error, results, fields) => {
        if (error) {
            console.error('Error in /api/organizations:', error);
            return res.status(500).json({ error: error.message });
        }
        res.status(200).json(results);
    });
});



// API endpoint to get a single organization
app.get('/api/organizations/nearby', (req, res) => {
    const userLat = parseFloat(req.query.lat);
    const userLon = parseFloat(req.query.lon);
    const maxDistance = parseFloat(req.query.distance);

    if (!userLat || !userLon || !maxDistance) {
        return res.status(400).send('Missing parameters');
    }

    const query = `
        SELECT Organizations.*, Addresses.latitude, Addresses.longitude 
        FROM Organizations 
        JOIN Addresses ON Organizations.address_id = Addresses.address_id`;

    connection.query(query, (err, rows) => {
        if (err) {
            console.error('Error in /api/organizations/nearby:', err);
            return res.status(500).send(err.message);
        }

        const nearbyOrganizations = rows.filter(org =>
            calculateDistance(userLat, userLon, org.latitude, org.longitude) <= maxDistance
        );

        res.json(nearbyOrganizations);
    });
});



// API endpoint to geo-code an address
app.get('/api/geocode', async (req, res) => {
    const address = req.query.address;
    try {
        const coordinates = await geocodeAddress(address);
        if (coordinates.error) {
            res.status(404).send(coordinates.error);
        } else {
            res.json(coordinates);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});



// Path to the organization page
app.get('/organization/:orgName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'organization-template.html'));
});

// API endpoint to get organization data
app.get('/api/organizationData/:orgName', (req, res) => {
    const orgName = req.params.orgName;

    // SQL query with column aliases
    const query = `
        SELECT Organizations.name AS orgName, Organizations.description, Organizations.logo, 
               Addresses.street, Addresses.city, Addresses.state, Addresses.zipCode, Addresses.latitude, Addresses.longitude,
               OrganizationContacts.name AS contactName, OrganizationContacts.email, OrganizationContacts.phone_number, OrganizationContacts.website
        FROM Organizations 
        LEFT JOIN Addresses ON Organizations.address_id = Addresses.address_id
        LEFT JOIN OrganizationContacts ON Organizations.organization_id = OrganizationContacts.organization_id 
        WHERE Organizations.name = ?`;

    connection.query(query, [orgName], (err, results) => {
        if (err) {
            console.error('Error in /api/organizationData/:orgName:', err);
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            const organizationData = results[0]; // Assuming orgName is unique and returns only one record
            res.json(organizationData);
        } else {
            res.status(404).send('Organization not found');
        }
    });
});


app.post('/submit/orgjobpost', upload.single('createJobForm'), (req, res) => {
    const sql = `
    INSERT INTO organization-template ( 
        VolTitle, 
        VoluPho, 
        descript, 
        street, 
        city, 
        District, 
        zipcode) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
        req.body.username,
        req.body.VolTitle,
        req.file.filename,
        req.body.descript,
        req.body.street,
        req.body.city,
        req.body.District,
        req.body.zipcode
    ];

    db.query(sql, values, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.sendFile(path.join(__dirname, 'public', 'organization-template.html'));
    });
});



// Start Server
app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}/`);
});

console.log(message);

/*

// Test function
async function testGeocoding() {
    // Create an address
    const testAddress = new Address("1600 Amphitheatre Parkway", "Mountain View", "CA", "94043");
    // Create an organization
    const testOrg = new Organization("username", "password", "logo", "name", "description", testAddress, "contact");
    // Update the geocode
    await testOrg.updateAddressGeocode();

    // Print the organization
    console.log(testOrg);
}


testGeocoding();

 */


