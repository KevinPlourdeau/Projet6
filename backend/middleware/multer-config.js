const multer = require('multer');


const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'jpg'
};

//Configuration de stockage avec Multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');  //Dossier où les images seront stockées
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);  //Génère un nom unique pour le fichier
    }
});

//Limite de taille de fichier (ici 10 Mo)
const limits = {
    fileSize: 10 * 1024 * 1024
};

//Middleware pour Multer
module.exports  = multer({ storage, limits }).single('image');

