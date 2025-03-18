const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Fonction pour inscrire un nouvel utilisateur
exports.signup = (req, res, next) => {
    //Hachage du mot de passe avec un salt de 10 tours
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //Création d'une instance d'utilisateur avec les informations reçues et le mot de passe haché
            const user = new User({
                email: req.body.email,
                password: hash  
            });
            //Sauvegarde de l'utilisateur dans la base de données
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Fonction pour connecter un utilisateur existant
exports.login = (req, res, next) => {
    //Recherche d'un utilisateur avec l'email fourni
    User.findOne({ email: req.body.email })
        .then(user => { 
            if (user === null) {
                res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
            } else {
                //Comparaison du mot de passe envoyé avec celui stocké dans la base de données
                bcrypt.compare(req.body.password, user.password)
                    .then(valid => {
                        if (!valid) {
                            res.status(401).json({ message: 'Paire identifiant/mot de passe incorrecte' });
                        } else {
                            //Si tout est valide, générer un token JWT
                            res.status(200).json({
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },  //Payload du token avec l'ID de l'utilisateur
                                    'RANDOM_TOKEN_SECRET',  //Clé secrète pour signer le token
                                    { expiresIn: '24h' }  //Durée de validité du token (24 heures)
                                )
                            });
                        }
                    })
                    .catch(error => {
                        res.status(500).json({ error });
                    })
            }
        })
        .catch(error => res.status(500).json({ error }));
};