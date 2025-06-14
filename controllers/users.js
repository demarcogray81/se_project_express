const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

const getUsers = (req, res, next) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(next);

const createUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((error) => {
      if (error.name === "ValidationError") {
        const err = new Error(error.message);
        err.statusCode = BAD_REQUEST;
        return next(err);
      }
      return next(error);
    });
};

const getUser = (req, res, next) =>
  User.findById(req.params.userId)
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((user) => res.status(200).send(user))
    .catch((error) => {
      if (error.name === "CastError") {
        const err = new Error("Invalid user ID format");
        err.statusCode = BAD_REQUEST;
        return next(err);
      }
      return next(error);
    });

module.exports = { getUsers, createUser, getUser };
