const User = require("../models/user");
const { BAD_REQUEST, NOT_FOUND } = require("../utils/errors");

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const createUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST;
      }
      next(err);
    });
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "CastError") {
        err.statusCode = BAD_REQUEST;
        err.message = "Invalid user ID format";
      }
      next(err);
    });
};

module.exports = { getUsers, createUser, getUser };
