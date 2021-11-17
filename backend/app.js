/*Le fichier "app.js" contient notre application express qui gère les réponses du server suite aux requêtes.*/

//Importation du package "express".
const express = require("express");

//création de l'application express.
const app = express();

//Importation du package "body-parser" qui facilite l'exploitation du corps des requêtes.
const bodyParser = require("body-parser");

//Importation du package "helmet" pour sécuriser l'application contre certaines vulnérabilités.
const helmet = require("helmet");

//Importation du package "path" qui donne accès au chemin du système de fichier server.
const path = require("path");

//Importation du routeur "userRoutes".
const userRoutes = require("./routes/user");

//Importation du routeur "sauceRoutes".
const sauceRoutes = require("./routes/sauce");

//Importation du package "mongoose" qui facilite la manipulation de la base de donné mongoDB.
const mongoose = require("mongoose");

//Connexion à la base de donnée mongoDB.
mongoose
  .connect(
    "mongodb+srv://Joank:joankoul1990@cluster0.2wqme.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connexion à mongoDB réussie !"))
  .catch(() => console.log("Connexion à mongoDB échoué !"));

//Définition des middlewares généraux de paramètrage:
//middleware de transformation des donnés JSON de la requête en objet javascript exploitable.
app.use(bodyParser.json());

//Sécurisation de l'application via l'inclusion d'en-tête configurée.
app.use(helmet());

//middleware d'ajout des headers pour lever les restrictions de sécurité CORS.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Définitions des middlewares de routing :
//middleware de réponse aux requêtes de la route "/image". Il sert le dossier "images".
app.use("/images", express.static(path.join(__dirname, "images")));

//middleware de réponse aux requêtes de la route racine "/api/auth".
app.use("/api/auth", userRoutes);

//middleware de réponse aux requêtes de la route racine "/api/sauces".
app.use("/api/sauces", sauceRoutes);

//Exportation de l'application "app.js" pour le rendre disponible dans le dossier backend.
module.exports = app;
