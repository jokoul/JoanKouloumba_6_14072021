/**Le fichier "Sauce.js" définit le modèle de ressource "sauce" créé avec mongoose
 * pour faciliter la lecture et l'écriture de donnée dans la base mongoDB. */

//Importation du package "mongoose".
const mongoose = require("mongoose");

//Création du schéma de donnée pour la sauce
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'-]+$/,
    required: true,
  },
  manufacturer: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'-]+$/,
    required: true,
  },
  description: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'-]+$/,
    required: true,
  },
  mainPepper: {
    type: String,
    match: /^[a-zA-Z0-9 éèêâäçûüîïôö'-]+$/,
    required: true,
  },
  imageUrl: { type: String, required: true },
  heat: { type: Number, min: 1, max: 10, required: true },
  likes: { type: Number, required: false },
  dislikes: { type: Number, required: false },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});

//Exportation du modèle de la sauce
module.exports = mongoose.model("Sauce", sauceSchema);
