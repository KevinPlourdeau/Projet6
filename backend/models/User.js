const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

//Définition du schéma de données pour le modèle 'User'
const userSchema = mongoose.Schema ({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

//Application du plugin uniqueValidator pour s'assurer que l'e-mail est unique dans la base de données
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);