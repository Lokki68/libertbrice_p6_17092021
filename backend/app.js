const express = require('express');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

mongoose
  .connect(
    'mongodb+srv://BriceLibert:LaithiBrice@cluster0.8cpci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussi'))
  .catch(() => console.log('Connexion à mongoDB à échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);

module.exports = app;
