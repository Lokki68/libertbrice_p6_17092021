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
  const userLike = req.body.like;
  const userId = req.body.userId;

  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const usersLiked = sauce.usersLiked;
    const usersDisliked = sauce.usersDisliked;

    if (userLike == 0) {
      const userLiked = usersLiked.find(usersId == userId);
      const userDisliked = usersDisliked.find(usersId == userId);

      // si déjà Like
      if (userLiked) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
        )
          .then(() => res.status(200).json({ message: 'Il aime plus' }))
          .catch((err) => res.status(500).json({ err }));

        // si déjà Dislike
      } else if (userDisliked) {
        Sauce.updateOne(
          { _id: req.params.id },
          { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
        )
          .then(() => res.status(200).json({ message: 'Il deteste plus' }))
          .catch((err) => res.status(500).json({ err }));
      }
    } else if (userLike == 1) {
      //ajout Usersliked et likes
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersLiked: userId }, $inc: { likes: 1 } }
      )
        .then(() => res.status(200).json({ message: 'Il aime' }))
        .catch((error) => res.status(400).json({ error }));

      //si -1
    } else if (userLike == -1) {
      //ajout Usersdisliked et  dislikes
      Sauce.updateOne(
        { _id: req.params.id },
        { $push: { usersDisliked: userId }, $inc: { dislikes: 1 } }
      )
        .then(() => res.status(200).json({ message: 'Il aime pas' }))
        .catch((error) => res.status(400).json({ error }));
    }
  });
};
