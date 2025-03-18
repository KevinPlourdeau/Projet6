const Book = require('../models/Book');
const fs = require('fs');

//Fonction pour créer un nouveau livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); //Récupération des données du livre
    delete bookObject._id;  //Suppression de l'ID du livre
    delete bookObject._userId;  //Suppression de l'ID de l'utilisateur (pour ne pas le modifier)

    //Création d'une instance du modèle Book avec les données du livre
    const book = new Book({
        ...bookObject,  //Copie des données du livre
        userId: req.auth.userId,  //Ajout de l'ID de l'utilisateur
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`  //URL de l'image téléchargée
    });

    //Sauvegarde du livre dans la base de données
    book.save()
        .then(() => {
            res.status(201).json({message: 'Livre enregistré !'});  //Réponse de succès
        })
        .catch(error => res.status(400).json({ error }));  //Gestion des erreurs
};

// Fonction pour modifier un livre existant
exports.modifyBook = (req, res, next) => {
    //Si un fichier est téléchargé, on met à jour l'image du livre, sinon on garde l'image actuelle
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };  //Si aucun fichier n'est téléchargé, on garde l'ancienne image

    delete bookObject._userId;  //On ne garde pas l'ID de l'utilisateur dans l'objet à mettre à jour

    //Recherche du livre dans la base de données
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {  //Vérification si l'utilisateur est bien celui qui a créé le livre
                return res.status(401).json({ message: 'Non autorisé' });
            } else {

                //Si une nouvelle image a été téléchargée, on supprime l'ancienne image
                if (req.file) {
                    const filename = book.imageUrl.split('/images/')[1];  //Récupération du nom de l'image du livre
                    fs.unlink(`images/${filename}`, (err) => {  //Suppression de l'ancienne image
                        if (err) {
                            return res.status(500).json({ message: 'Erreur lors de la suppression de l\'ancienne image' });
                        }

                        //Mise à jour du livre avec la nouvelle image
                        Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                            .then(() => {
                                res.status(200).json({ message: 'Livre modifié avec nouvelle image !' });
                            })
                            .catch(error => res.status(500).json({ error }));
                    });
                } else {
                    // Si aucune nouvelle image n'est téléchargée, on met juste à jour les autres données du livre
                    Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Livre modifié sans changement d\'image !' });
                        })
                        .catch(error => res.status(500).json({ error }));
                }
            }
        })
        .catch(error => res.status(400).json({ error }));
};


//Fonction pour supprimer un livre
exports.deleteBook = (req, res, next) => {
    //Recherche du livre dans la base de données
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {  //Vérification si l'utilisateur est bien celui qui a créé le livre
                res.status(401).json({ message: 'non-autorisé' });
            } else {
                const filename = book.imageUrl.split('/images/')[1];  //Récupération du nom de l'image du livre
                fs.unlink(`images/${filename}`, () => {  //Suppression de l'image
                    Book.deleteOne({ _id: req.params.id })  //Suppression du livre dans la base de données
                        .then(() => { 
                            res.status(200).json({ message: 'Livre supprimé !' });
                        })
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch(error => res.status(500).json({ error }));
};

//Fonction pour noter un livre
exports.rateBook = (req, res, next) => {
    const { userId, rating } = req.body;  //Récupération de l'ID de l'utilisateur et de la note
    const bookId = req.params.id;  //Récupération de l'ID du livre

    if (rating < 0 || rating > 5) {  //Vérification que la note est comprise entre 0 et 5
        res.status(400).json({ message: 'La note doit être comprise entre 0 et 5.' });
    }

    //Recherche du livre dans la base de données
    Book.findOne({ _id: bookId })
        .then((book) => {
            if (!book) {
                res.status(404).json({ message: 'Livre non trouvé.' });
            }

            const existingRating = book.ratings.find(r => r.userId === userId);  //Vérification si l'utilisateur a déjà noté ce livre
            if (existingRating) {
                res.status(403).json({ message: 'Vous avez déjà noté ce livre.' });
            }

            //Ajout de la note de l'utilisateur
            book.ratings.push({ userId, grade: rating });

            //Calcul de la note moyenne
            const totalRatings = book.ratings.length;
            const averageRating = book.ratings.reduce((acc, r) => acc + r.grade, 0) / totalRatings;
            book.averageRating = averageRating;

            //Sauvegarde du livre avec la nouvelle note
            return book.save();
        })
        .then((book) => res.status(200).json(book))
        .catch(error => res.status(500).json({ error }));
};

//Fonction pour récupérer un seul livre par son ID
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })  //Recherche du livre par son ID
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ error }));
};

//Fonction pour récupérer tous les livres
exports.getAllBooks = (req, res, next) => {
    Book.find()  //Recherche de tous les livres
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

//Fonction pour récupérer les livres avec les meilleures notes
exports.getBestRatedBooks = (req, res, next) => {
    Book.find().sort({ averageRating: -1 }).limit(3)  //Trie les livres par note décroissante et limite à 3
        .then(books => res.status(200).json(books))  
        .catch(error => res.status(400).json({ error }));
};
