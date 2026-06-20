const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const booksRoutes = require('./routes/book');
const path = require('path');

const dns = require('node:dns');
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();

mongoose.connect('mongodb+srv://Daeliora2:GoTest@cluster0.gmy0xny.mongodb.net',
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

//Erreurs de CORS  
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());


app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;
