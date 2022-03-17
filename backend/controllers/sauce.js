const Sauces = require("../models/sauces");
const fs = require("fs");
const sauces = require("../models/sauces");

exports.createSauces = (req, res, next) => {
  const Data = JSON.parse(req.body.sauce);
  delete Data._id;
  const sauce = new Sauces({
    ...Data,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
exports.getOneSauces = (req, res, next) => {
  Sauces.findOne({
    _id: req.params.id,
  })
    .then((Sauces) => {
      res.status(200).json(Sauces);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

exports.modifySauces = (req, res, next) => {
  const Data = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  if(req.file){
    Sauces.findOne({ _id: req.params.id })
      .then((Sauce) => {
        const filename = Sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          console.log(Data);
          Sauces.updateOne(
            {_id: req.params.id },
            {...Data, _id: req.params.id },
          )
          .then(() => res.status(200).json({ message: "Objet modifié !" }))
          .catch((error) => res.status(400).json({ error }));
        });
      })
      .catch((error) => res.status(500).json({ error }));
  } else {
    Sauces.updateOne(
      { _id: req.params.id },
      { ...Data, _id: req.params.id }
    )
      .then(() => res.status(200).json({ message: "Objet modifié !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

exports.deleteSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((Sauce) => {
      const filename = Sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  Sauces.find()
    .then((Sauces) => {
      res.status(200).json(Sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

exports.likeSauces = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((Sauce) => {
      const Data = req.body;
      
      let UserLiked = Sauce.usersLiked.includes(Data.userId);
      let UserDisliked = Sauce.usersDisliked.includes(Data.userId);
      let userWantLike = (Data.like == 1);
      let userWantDislike = (Data.like == -1);
      let userWantUndo = (Data.like === 0);

      if (userWantLike) {
        Sauce.usersLiked.push(Data.userId)
      }
      if (userWantDislike) {
        Sauce.usersDisliked.push(Data.userId);
      }
      if (userWantUndo) {
        if (UserDisliked) {
          let index = Sauce.usersDisliked.findIndex(element => element = Data.userId);
          Sauce.usersLiked.splice(index, 1);
        }
        if (UserLiked) { 
          let index = Sauce.usersLiked.findIndex(element => element == Data.userId);
          Sauce.usersLiked.splice(index, 1);
        }
      }
      Sauce.likes = Sauce.usersLiked.length;
      Sauce.dislikes = Sauce.usersDisliked.length;
      Sauce.save();
      return Sauce

  })
  .then(() => res.status(200).json({ message: "Objet modifié !" }))
  .catch((error) => res.status(500).json({ error }));
};