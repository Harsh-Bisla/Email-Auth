const mongoose = require('mongoose');

async function connectMongoDb(url) {
    try {
        await mongoose.connect(url);
    } catch (error) {
        console.log("Mongo DB connection error")
    }
}

module.exports = connectMongoDb;