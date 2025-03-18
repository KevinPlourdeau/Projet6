const http = require('http');
const app = require('./app');

//Fonction pour normaliser le port (convertir en entier ou garder le nom du pipe)
const normalizePort = val => {
  const port = parseInt(val, 10); //Conversion du port en entier

  //Si ce n'est pas un nombre valide, retourner la valeur d'origine (nom du pipe)
  if (isNaN(port)) {
    return val;
  }
  //Si le port est positif ou nul, on le retourne
  if (port >= 0) {
    return port;
  }
  //Si le port est invalide, on retourne false
  return false;
};

//Normalisation du port à partir de la variable d'environnement ou de '4000' par défaut
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port); //Définir le port sur l'application Express

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  
  const address = server.address(); //Récupérer l'adresse du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  
  //Gérer les erreurs liées à l'accès ou au port déjà utilisé
  switch (error.code) {
    case 'EACCES': //Permission refusée
      console.error(bind + ' requires elevated privileges.');
      process.exit(1); //Quitter le processus avec une erreur
      break;
    case 'EADDRINUSE': //Adresse déjà utilisée
      console.error(bind + ' is already in use.');
      process.exit(1); //Quitter le processus avec une erreur
      break;
    default: //Pour toute autre erreur
      throw error;
  }
};

//Création du serveur HTTP avec l'application Express
const server = http.createServer(app);

//Écoute des erreurs et gestion des événements d'écoute
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address(); //Récupérer l'adresse d'écoute du serveur
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind); //Afficher que le serveur est en écoute
});

//Démarrage du serveur sur le port spécifié
server.listen(port);