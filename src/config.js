const mongoose = require('mongoose'); //Here, you're importing the Mongoose library into your Node.js application. Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js, designed to work with MongoDB.
const connect = mongoose.connect("mongodb://localhost:27017/Login-tut");//This line establishes a connection to the MongoDB database 

// Check database connected or not
connect.then(() => {
    console.log("Database Connected Successfully");
})

.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Loginschema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// collection part
const collection = new mongoose.model("users", Loginschema);

module.exports = collection;//exporting this module so that it can be used in other parts of node js applications