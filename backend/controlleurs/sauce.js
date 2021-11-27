/**Le fichier "user.js" du dossier "controllers" définit la logique métier de la réponse au requête.*/

//Importation du modèle "Sauce".
const Sauce = require("../models/Sauce");

//Importation du package "fs" qui permet d'accéder aux opérations liés au système de fichier.
const fs = require("fs");

//Exportation de la fonction callback "createSauce".
exports.createSauce = (req, res, next) => {
  //Transformation de la chaîne json en objet javascript.
  const sauceObject = JSON.parse(req.body.sauce);
  //si un identifiant est transmit dans la requête, on le supprime.
  delete sauceObject._id;
  //Instanciation du modèle "sauce" pour l'ajout dans la base MongoDB.
  const sauce = new Sauce({
    ...sauceObject,
    //Modification de l'url de l'image car le nom du fichier à évoluer.
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    //Modification des autres champs du modèle.
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  //Enregistrement de l'instance dans la base MongoDB.
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce enregistrée !" }))
    .catch((error) => res.status(400).json({ error }));
};

//Exportations de la fonction callback "getAllSauces".
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//Exportation de la fonction callback "getOneSauce".
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ error }));
};

//Exportation de la fonction callback "modifySauce".
exports.modifySauce = (req, res, next) => {
  //Récupération de l'objet "sauce" selon 2 cas de modification : avec fichier image ou sans fichier image.
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  //On modifie la sauce en vérifiant que l'identifiant de la base et de la requête correspondent pour la sauce et l'utilisateur.
  Sauce.updateOne(
    { _id: req.params.id, userId: req.body.userId },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
    .catch((error) => res.status(403).json({ error }));
};

//Exportation de la fonction callback "deleteSauce".
exports.deleteSauce = (req, res, next) => {
  //On trouve d'abord la ressource à supprimer.
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      //Extraction du nom du fichier image à supprimer.
      const filename = sauce.imageUrl.split("/images/")[1];
      //Suppression de la ressource "sauce" et du fichier image associé.
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(400).json({ error }));
};

//Exportation de la fonction callback "modifyLikeSauce".
exports.modifyLikeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;

  //Si like == 1 alors on incrémente le champ "likes" de +1 et on rajoute "userId" au tableau "usersLiked"
  if (like == 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: +1 },
        $push: { usersLiked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "likes ajoutée !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //Si like == -1 alors on incrémente le champ "dislikes" de +1 et on rajoute "userId" au tableau "usersLiked"
  if (like == -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: +1 },
        $push: { usersDisliked: userId },
      }
    )
      .then(() => res.status(200).json({ message: "dislikes ajoutée !" }))
      .catch((error) => res.status(400).json({ error }));
  }

  //Si Like == 0, le "likes" ou "dislikes" de l'utilisateur est annulé et son userId retiré du tableau correspondant
  if (like == 0) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        //Si "userId" est inclus dans le tableau "usersLiked"
        if (sauce.usersLiked.includes(userId)) {
          //on retire son "like" du champs "likes" et son "userId" du tableau "usersLiked"
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: userId },
            }
          )
            .then(() => res.status(200).json({ message: "likes retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
        //Si "userId" est inclus dans le tableau "usersDisliked"
        if (sauce.usersDisliked.includes(userId)) {
          //on retire son "like" du champs "dislikes" et son "userId" du tableau "usersDisliked"
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: userId },
            }
          )
            .then(() => res.status(200).json({ message: "dislikes retiré !" }))
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
};
