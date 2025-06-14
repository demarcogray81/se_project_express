const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST;
      }
      next(err);
    });
};

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);
};

const deleteItems = (req, res, next) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST;
        err.message = "Invalid item ID format";
      }
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST;
        err.message = "Invalid item ID format";
      }
      next(err);
    });
};

const unlikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST;
        err.message = "Invalid item ID format";
      }
      next(err);
    });
};

module.exports = { createItem, getItems, deleteItems, likeItem, unlikeItem };
