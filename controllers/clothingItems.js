const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require("../utils/errors");

// GET /items
const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch(next);
};

// POST /items
const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  ClothingItem.create({ name, imageUrl, weather, owner: req.user._id })
    .then((item) => res.status(201).send(item)) // <= was { data: item }
    .catch((err) => {
      if (err.name === "ValidationError") err.statusCode = BAD_REQUEST;
      next(err);
    });
};

// DELETE /items/:itemId
const deleteItems = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findById(itemId)
    .orFail(() =>
      Object.assign(new Error("Item not found"), { statusCode: NOT_FOUND })
    )
    .then((item) => {
      if (String(item.owner) !== String(req.user._id)) {
        const e = new Error("You can only delete your own items");
        e.statusCode = FORBIDDEN;
        throw e;
      }
      return item.deleteOne().then(() => res.send(item)); // <= send item
    })
    .catch((err) => {
      if (err.name === "CastError") err.statusCode = BAD_REQUEST;
      next(err);
    });
};

// PUT /items/:itemId/likes
const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() =>
      Object.assign(new Error("Item not found"), { statusCode: NOT_FOUND })
    )
    .then((item) => res.send(item)) // <= was { data: item }
    .catch((err) => {
      if (err.name === "CastError") err.statusCode = BAD_REQUEST;
      next(err);
    });
};

// DELETE /items/:itemId/likes
const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() =>
      Object.assign(new Error("Item not found"), { statusCode: NOT_FOUND })
    )
    .then((item) => res.send(item)) // <= was { data: item }
    .catch((err) => {
      if (err.name === "CastError") err.statusCode = BAD_REQUEST;
      next(err);
    });
};

module.exports = { createItem, getItems, deleteItems, likeItem, unlikeItem };
