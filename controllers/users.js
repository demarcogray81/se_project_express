const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const User = require("../models/user");
const {
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// POST /signin
const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      const e = new Error("Incorrect email or password");
      e.statusCode = UNAUTHORIZED;
      next(e);
    });
};

// POST /signup
const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash, avatar }))
    .then((u) =>
      res
        .status(201)
        .send({ _id: u._id, name: u.name, email: u.email, avatar: u.avatar })
    )
    .catch((err) => {
      if (err.code === 11000) {
        err.statusCode = CONFLICT;
        err.message = "User with this email already exists";
      } else if (err.name === "ValidationError") err.statusCode = BAD_REQUEST;
      next(err);
    });
};
// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() =>
      Object.assign(new Error("User not found"), { statusCode: NOT_FOUND })
    )
    .then((u) =>
      res.send({ _id: u._id, name: u.name, email: u.email, avatar: u.avatar })
    ) // <= plain object
    .catch(next);
};

// PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() =>
      Object.assign(new Error("User not found"), { statusCode: NOT_FOUND })
    )
    .then((u) =>
      res.send({ _id: u._id, name: u.name, email: u.email, avatar: u.avatar })
    ) // <= plain object
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError")
        err.statusCode = BAD_REQUEST;
      next(err);
    });
};

module.exports = { login, createUser, getCurrentUser, updateUser };
