const ClothingItem = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, FORBIDDEN } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item.toObject()))
    .catch((error) => {
      if (error.name === "ValidationError") {
        const err = new Error("Invalid item data");
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
  const { itemId } = req.params;

  return ClothingItem.findById(itemId)
    .orFail(() => {
      const err = new Error("Item not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        const err = new Error("You are not allowed to delete this item");
        err.statusCode = FORBIDDEN;
        throw err;
      }

      const deletedItemData = item.toObject();
      return item.deleteOne().then(() => {
        res.status(200).send({
          message: "Item successfully deleted",
          data: deletedItemData,
        });
      });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        const err = new Error("Invalid item ID format");
        err.statusCode = BAD_REQUEST;
        return next(err);
      }
      return next(error);
    });
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
