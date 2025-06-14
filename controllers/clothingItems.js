const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((error) => {
      if (error.name === "ValidationError") {
        const err = new Error(error.message);
        err.statusCode = BAD_REQUEST;
        return next(err);
      }
      return next(error);
    });
};

const getItems = (req, res, next) =>
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch(next);

const deleteItems = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.itemId)) {
    const err = new Error("Invalid item ID format");
    err.statusCode = BAD_REQUEST;
    return next(err);
  }
  ClothingItem.findByIdAndDelete(req.params.itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch(next);
};

const likeItem = (req, res, next) =>
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
    .catch((error) => {
      if (error.name === "CastError") {
        const err = new Error("Invalid item ID format");
        err.statusCode = BAD_REQUEST;
        return next(err);
      }
      return next(error);
    });

const unlikeItem = (req, res, next) =>
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
    .catch((error) => {
      if (error.name === "CastError") {
        const err = new Error("Invalid item ID format");
        err.statusCode = BAD_REQUEST;
        return next(err);
      }
      return next(error);
    });

module.exports = { createItem, getItems, deleteItems, likeItem, unlikeItem };
