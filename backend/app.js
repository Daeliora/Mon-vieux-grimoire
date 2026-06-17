const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');


const dns = require('node:dns');
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const app = express();

mongoose.connect('mongodb+srv://Daeliora2:GoTest@cluster0.gmy0xny.mongodb.net',
)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.log('Connexion à MongoDB échouée !', err));

app.use((req, res, next) => {
  console.log('Requête reçue !');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Votre requête a bien été reçue !' });
  next();
});

app.use((req, res, next) => {
  console.log('Réponse envoyée avec succès !');
});

app.use('/api/auth', userRoutes);

module.exports = app;

