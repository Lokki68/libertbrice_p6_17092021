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
    usersLiked: [' '],
    usersDisliked: [' '],
    likes: 0,
    dislikes: 0,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrer' }))
    .catch((error) => res.status(400).json({ message: error }));
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
    .then(() => res.status(201).json({ message: 'Sauce modifiée' }))
    .catch((err) => res.status(400).json({ message: err }));
};

// Delete Sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(201).json({ message: 'Sauce supprimée !!' }))
          .catch((err) => res.status(400).json({ message: err }));
      });
    })
    .catch((err) => res.status(500).json({ err }));
};

// GetOne Sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ message: error }));
};

// GetAll Sauce
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ message: error }));
};

// Post likeSauce
exports.likeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  switch (like) {
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      )
        .then(() => res.status(200).json({ message: "J'aime cette sauce" }))
        .catch((error) => res.status(400).json({ message: error }));

      break;

    case 0:
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            )
              .then(() =>
                res.status(200).json({ message: "Je n'aime plus cette sauce" })
              )
              .catch((err) => res.status(400).json({ message: err }));
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { disliked: -1 } }
            )
              .then(() =>
                res
                  .status(200)
                  .json({ message: "J'aime bien cette sauce finalement" })
              )
              .catch((err) => res.status(400).json({ message: err }));
          }
        })
        .catch((err) => res.status(400).json({ error: err }));
      break;

    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { disliked: +1 } }
      )
        .then(() => {
          res.status(200).json({ message: "Je n'aime pas cette sauce" });
        })
        .catch((err) => res.status(400).json({ message: err }));
      break;

    default:
      console.log(error);
  }
};
