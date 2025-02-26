const express = require('express');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const path = require('path');

const app = express();

mongoose.connect('mongodb+srv://:@cluster0.80ott.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200); // Répondre immédiatement aux requêtes OPTIONS
    }

    next();
});

app.use(express.json());

app.use('/api/books', booksRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
