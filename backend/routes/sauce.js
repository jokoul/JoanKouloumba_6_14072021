/**Le fichier "sauce.js" du dossier "routes" définit la logique de routing spécifique à la ressource "sauce".*/

//Importation du package "express".
const express = require("express");

//création du routeur pour les routes "sauce".
const router = express.Router();

//Importation du middleware "auth.js" pour la vérification des tokens.
const auth = require("../middlewares/auth");

//Importation du middleware "multer-config" pour la gestion des fichiers téléchargés.
const multer = require("../middlewares/multer-config");

//Importation du contrôleur.
const saucesCtrl = require("../controlleurs/sauce");

//Définition des routes spécifiques de la sauce.
router.get("/", auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, saucesCtrl.deleteSauce);
router.post("/:id/like", saucesCtrl.modifyLikeSauce);

//Exportation du router
module.exports = router;
