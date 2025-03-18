const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

//Fonction pour traiter l'image (compression + redimensionnement avec Sharp)
function processImage(req, res, next) {
  //Vérification si un fichier a été téléchargé
  if (req.file) {
    const filePath = req.file.path; //chemin du fichier téléchargé
    const fileName = path.basename(filePath);
    const newFileName = 'compressed_' + fileName;
    const newFilePath = path.join(path.dirname(filePath), newFileName);  //nouveau chemin pour l'image compressée

    //Créer un flux de lecture à partir du fichier original
    const readStream = fs.createReadStream(filePath);
    //Créer un flux d'écriture pour le nouveau fichier compressé
    const writeStream = fs.createWriteStream(newFilePath);

    //Utiliser Sharp pour redimensionner et compresser l'image
    const transform = sharp().resize(800);

    readStream
      .pipe(transform)  //Appliquer le redimensionnement
      .pipe(writeStream)  //Écrire le fichier compressé
      .on('finish', () => {
        //Une fois l'écriture terminée, supprimer le fichier original
        fs.unlink(filePath, (err) => {
          if (err) {
            return next(err);
          }
          req.file.filename = newFileName;  //Mettre à jour le nom du fichier compressé
          req.file.path = newFilePath;  //Mettre à jour le chemin du fichier compressé
          next();  //Passer au middleware suivant
        });
      })
      .on('error', (err) => {
        next(err);
      });
  } else {
    next();  //Si aucun fichier n'est téléchargé, passer au middleware suivant
  }
}

module.exports = (processImage);