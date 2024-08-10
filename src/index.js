//nodemon src index.js to run this web app
const express = require("express");// create applications,define routes, handles req ad res
const path = require("path"); //building file paths, extracting file components 
const collection = require("./config");
const bcrypt = require('bcrypt'); //library used for hashing passwords

const app = express();//creating a express application
// convert data into json format
app.use(express.json()); //configures Express.js to parse incoming request bodies with JSON payloads
app.use(express.static("public"));//applications can use the static files which are in the public folder

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine 
app.set("view engine", "ejs");
//EJS enables server-side rendering by allowing you to generate HTML content on the server before sending it to the client, which can improve page load times and make your content more accessible to search engines.  for complex web applications with dynamic features and data-driven content, HTML alone may be insufficient.
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});
app.get('/g1', (req, res) => {
    // Render the "g1.ejs" page here
    res.render("g1");
});
app.get('/g2', (req, res) => {
    res.render("g2");
});
app.get('/g3', (req, res) => {
    res.render("g3");
});
// Register User
app.post("/signup", async (req, res) => {

    const data = {
        name: req.body.username,     //requesting data from user
        password: req.body.password
    }
    
    // Check if the username already exists in the database
    const existingUser = await collection.findOne({ name: data.name });
    
    if (existingUser) {
        res.send('User already exists. Please choose a different username.');
    } else {
        // Hash the password using bcrypt
        const saltRounds = 10; // Number of salt rounds for bcrypt
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        
        data.password = hashedPassword; // Replace the original password with the hashed one
        
        const userdata = await collection.insertMany(data);
        console.log(userdata);
    }

});

// Login user 
app.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send("User name cannot found")
        }
        // Compare the hashed password from the database with the plaintext password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            res.send("wrong Password");
        }
        else {
            res.render("home",{ username: req.body.username });
        }
    }
    catch {
        res.send("wrong Details");
    }
});


// Define Port for Application
const port = 4000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});