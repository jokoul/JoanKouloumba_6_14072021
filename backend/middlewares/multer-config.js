/**Le fichier "multer-config.js" définit les configurations du package "multer" qui gère les fichiers entrants.*/

//Importation du package "multer" qui gère les fichiers envoyés avec la requête.
const multer = require("multer");

//Création du dictionnaire MIME_TYPES qui servira à la génération de l'extension du fichier.
const MIME_TYPES = {
  "images/jpg": "jpg",
  "images/jpeg": "jpg",
  "images/png": "png",
};

//création d'un objet de configuration pour "multer".
const storage = multer.diskStorage({
  //on indique à "multer" dans quel dossier enregistrer le fichier
  destination: (req, file, callback) => {
    //appelle du callback avec le nom du dossier en second argument
    callback(null, "images");
  },
  //on indique à "multer" le nom du fichier à utiliser
  filename: (req, file, callback) => {
    //création d'un nouveau nom de fichier à partir du nom d'origine
    const name = req.file.filename.split(" ").join("_");
    //génération de l'extension à partir du mimetype du fichier
    const extension = MIME_TYPES[file.mimeType];
    //appelle du callback avec le nouveau nom en second argument
    callback(null, name + Date.now() + "." + extension);
  },
});

//Exportation du middleware de configuration de multer en lui indiquant qu'il s'agit d'un fichier d'image unique.
module.exports = multer({ storage: storage }).single("image");
