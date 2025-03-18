const express = require('express');
const mongoose = require('mongoose');

const booksRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

const path = require('path');

const app = express();

require('dotenv').config();

//Connexion à MongoDB avec Mongoose
mongoose.connect(process.env.MONGODB_URI,
  { useNewUrlParser: true,  //Utilisation de l'URL de connexion MongoDB
    useUnifiedTopology: true })  //Activation du gestionnaire unifié des connexions
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Middleware pour gérer les en-têtes HTTP (CORS)
app.use((req, res, next) => {
    //Permet à toutes les origines d'accéder à l'API
    res.setHeader('Access-Control-Allow-Origin', '*');
    //Permet d'utiliser certains en-têtes spécifiques
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //Permet certaines méthodes HTTP comme GET, POST, PUT, DELETE
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();  //Passe au middleware suivant
});

//Middleware pour analyser le corps des requêtes au format JSON
app.use(express.json());

//Utilisation des routes définies pour les livres et l'authentification
app.use('/api/books', booksRoutes);  //Toutes les requêtes /api/books seront gérées par booksRoutes
app.use('/api/auth', authRoutes);  //Toutes les requêtes /api/auth seront gérées par authRoutes

//Serveur des images statiques depuis le dossier "images"
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
