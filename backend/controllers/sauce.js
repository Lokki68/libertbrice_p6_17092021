const Sauce = require('../models/Sauce');
const fs = require('fs');

// Post Create Sauce

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrer' }))
    .catch((error) => res.status(400).json({ error }));
};

// Post likeSauce
exports.likeSauce = (req, res, next) => {
  const userLike = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const usersLiked = sauce.usersLike;
      const usersDisliked = sauce.usersDisliked;

      if (userLike == 0) {
        const foundUserLiked = usersLiked.find((usersId) => usersId == usersId);
        const foundUserDisliked = usersDisliked.find(
          (usersId) => usersId == usersId
        );

        if (foundUserLiked) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
          )
            .then(() =>
              res.status(200).json({ message: "Je n'aime plus cette sauce" })
            )
            .catch((error) => res.status(400).json({ error }));
        } else if (foundUserDisliked) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
          )
            .then(() => res.status(200).json({ message: "J'aime cette sauce" }))
            .cathc((error) => res.status(400).json({ error }));
        }
      } else if (userLike == 1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersliked: userId }, $inc: { likes: 1 } }
        )
          .then(() => res.status(200).json({ message: "J'aime cette sauce" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (userLike == -1) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersDisliked: userId }, $inc: { dislikes: 1 } }
        )
          .then(() =>
            res.status(200).json({ message: "J'aime pas cette sauce" })
          )
          .catch((error) => res.status(400).json({ error }));
      }
    })
    .catch((error) => res.status(404).json({ error }));
};

// Put Modify Sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: 'Sauce modifier' }))
    .catch((err) => res.status(400).json({ err }));
};

// Delete Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(204).json({ message: 'Sauce supprimer' }))
          .catch((err) => res.status(400).json({ err }));
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

// GetOne Sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ err: error }));
};

// GetAll Sauce
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(400).json({ err: error }));
};
