const mongoose = require('mongoose');
require('dotenv').config();

// const connection = mongoose.connect('mongodb://127.0.0.1:27017/User');
// const connection = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@jewelnme.zq4tgil.mongodb.net/`

const connection = process.env.DB_URL;
mongoose.connect(connection, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB Atlas');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB Atlas:', error);
    });
module.exports = connection;