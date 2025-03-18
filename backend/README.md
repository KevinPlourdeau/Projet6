# Backend API

Ce projet représente l'API backend d'une application de gestion des livres.

## Dépendances

Pour faire fonctionner ce projet, vous devez installer les dépendances suivantes:

### Dépendances principales
**express**: Framework web pour Node.js --> npm install express
**nodemon**: server live --> npm install nodemon ( commande server live = "nodemon server")
**mongoose**: ODM pour MongoDB --> npm install mongoose
**bcrypt**: Bibliothèque de hachage pour les mots de passe --> npm install bcrypt
**jsonwebtoken**: Gestion de l'authentification basée sur des tokens --> npm install jsonwebtoken
**multer**: Middleware pour la gestion des fichiers téléchargés --> npm install multer
**sharp**: Bibliothèque de manipulation d'images --> npm install sharp
**dotenv**: Chargement des variables d'environnement depuis un fichier `.env` --> creation d'un fichier .env

### Commande pour installer les dépendances

Dans le répertoire du projet, exécutez la commande suivante pour installer toutes les dépendances:

```bash
npm install express mongoose bcrypt jsonwebtoken multer sharp
```

### Variables d'environnement

Dans le fichier `.env`, définissez les variables suivantes:

- **MONGODB_URI**: L'URL de votre base de données MongoDB (ex: `mongodb+srv://<username>:<password>@<cluster>/mydb`)

## Fonctionnalités

### Gestion des livres
**Créer un livre** : Envoie une requête `POST` à `/api/books` avec les données du livre et l'image à télécharger.
**Modifier un livre** : Envoie une requête `PUT` à `/api/books/:id` pour modifier un livre existant.
**Supprimer un livre** : Envoie une requête `DELETE` à `/api/books/:id` pour supprimer un livre.
**Obtenir un livre** : Envoie une requête `GET` à `/api/books/:id` pour récupérer les détails d'un livre.
**Obtenir tous les livres** : Envoie une requête `GET` à `/api/books` pour récupérer la liste de tous les livres.
**Obtenir les livres les mieux notés** : Envoie une requête `GET` à `/api/books/bestrating` pour récupérer les livres les mieux notés.

### Gestion des utilisateurs
**Inscription** : Envoie une requête `POST` à `/api/auth/signup` avec un email et un mot de passe pour créer un utilisateur.
**Connexion** : Envoie une requête `POST` à `/api/auth/login` avec un email et un mot de passe pour se connecter.

### Configuration CORS
Les en-têtes HTTP CORS sont configurés pour permettre à l'API d'être utilisée par des applications frontend sur des domaines différents.

## Lancer le projet
Une fois les dépendances installées et le fichier `.env` configuré, vous pouvez lancer le serveur avec la commande suivante:

```bash
nodemon server
```

Le serveur sera accessible sur `http://localhost:4000`. --> Utilsiatioin de PostMan



