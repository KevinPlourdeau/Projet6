const jwt = require('jsonwebtoken');

//Middleware d'authentification pour vérifier et décoder le token JWT
module.exports = (req, res, next) => {
   try {
       //Récupération du token à partir des headers de la requête (attendu sous la forme "Bearer <token>")
       const token = req.headers.authorization.split(' ')[1];  
       //Vérification du token en utilisant la clé secrète pour valider son intégrité et le décoder
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');  
       //Récupération de l'ID utilisateur à partir du token décodé
       const userId = decodedToken.userId;  
       //Ajout de l'ID utilisateur à la requête pour permettre une utilisation dans les autres middlewares ou contrôleurs
       req.auth = {
           userId: userId  
       };
       
       next(); 

   } catch(error) {
       res.status(401).json({ error });  
   }
};