require('dotenv').config();
const mongoose = require('mongoose');
const uri = process.env.MONGODB_URI;

const options = {
    serverSelectionTimeoutMS: 30000, 
};

async function connectToDatabase() {
    if (!mongoose.connection.readyState) {
        await mongoose.connect(uri, options);
        console.log('Connected to MongoDB');
    }
    return mongoose.connection;
}

module.exports = { connectToDatabase };
