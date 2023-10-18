// database.js

const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('Error connecting to MongoDB:', error);
});

db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
