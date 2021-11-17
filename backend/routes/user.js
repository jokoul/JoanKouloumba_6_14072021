/*Le fichier "user.js" du dossier "routes" définit la logique de routing spécifique à la ressource "user".*/

//importation du package "express".
const express = require("express");

//création du routeur pour les routes de l'utilisateur.
const router = express.Router();

//Importation du controleur des routes de l'utilisateur.
const userCtrl = require("../controlleurs/user");

//Définition des routes spécifiques pour l'utilisateur.
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

//Exportation du routeur "user".
module.exports = router;
