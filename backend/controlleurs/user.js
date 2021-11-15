/**Le fichier "user.js" du dossier "controllers" définit la logique métier de la ressource "user".*/

//importation du modèle "User".
const User = require("../models/User");

//Importation du package "jsonwebtoken" pour créer et vérifier des tokens.
const jwt = require("jsonwebtoken");

//Importation du package "bcrypt" pour crypter et lire les mots de passe.
const bcrypt = require("bcrypt");

//Exportation de la fonction "signup" qui permet la création de nouveau compte utilisateur.
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      //Instanciation d'un modèle "User" pour l'écriture dans la base MongoDB.
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      //puis, enregistrement de l'instance dans la base mongoDB.
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

//Exportation de la fonction "login" pour la connexion à un compte utilisateur.
exports.login = (req, res, next) => {
  //D'abord, on trouve un utilisateur dans la base ayant l'email dans la requête.
  User.findOne({ email: req.body.email })
    .then((user) => {
      //On vérifie si on a récupéré un "user" ou non dans la base.
      if (!user) {
        //Si on ne trouve pas de "user" correspondant à cet email.
        return res.status(401).json({ error: "Utilisateur non trouvée !" });
      }
      //Si on trouve un "user", on compare les mots de passe de la requête à celui dans la base.
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          //Si les mots de passe ne correspondent pas.
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          //Si les mots de passe correspondent.
          res.status(200).json({
            //Attribution d'un token.
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
