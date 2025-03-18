const express = require('express');
const auth = require('../middleware/auth');
const multer= require('../middleware/multer-config');
const processImage = require('../middleware/sharp-config');
const router = express.Router();

const booksCtrl = require('../controllers/Books');


//Autorisation de voir les livres sans authentification
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRatedBooks);
router.get('/:id', booksCtrl.getOneBook);

//Restriction des actions sensibles aux utilisateurs connectés
router.post('/', auth, multer, processImage, booksCtrl.createBook);
router.put('/:id', auth, multer, processImage,  booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);
router.post('/:id/rating', auth, booksCtrl.rateBook);



module.exports = router;