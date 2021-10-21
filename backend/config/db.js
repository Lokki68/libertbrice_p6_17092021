const mongoose = require('mongoose');

mongoose
  .connect(
    'mongodb+srv://' +
      process.env.MONGODB_PASS +
      '@cluster0.8cpci.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('Connexion à MongoDB réussi'))
  .catch(() => console.log('Connexion à mongoDB à échouée !'));
