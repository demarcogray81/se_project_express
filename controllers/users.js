// controllers/users.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const validator = require("validator"); // <- not used; safe to remove if unused
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");

// custom error classes
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../errors");

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
    .catch(() => {
      // don’t leak whether email exists; uniform auth error
      next(new UnauthorizedError("Incorrect email or password"));
    });
};

// POST /signup
const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash, avatar }))
    .then((u) => {
      res
        .status(201)
        .send({ _id: u._id, name: u.name, email: u.email, avatar: u.avatar });
    })
    .catch((err) => {
      if (err.code === 11000) {
        // duplicate key (email)
        return next(new ConflictError("User with this email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid user data"));
      }
      return next(err);
    });
};

// GET /users/me
const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => new NotFoundError("User not found"))
    .then((u) => {
      res.send({ _id: u._id, name: u.name, email: u.email, avatar: u.avatar });
    })
    .catch((err) => {
      // e.g., bad ObjectId format
      if (err.name === "CastError") {
        return next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

// PATCH /users/me
const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("User not found"))
    .then((u) => {
      res.send({ _id: u._id, name: u.name, email: u.email, avatar: u.avatar });
    })
    .catch((err) => {
      if (err.name === "ValidationError" || err.name === "CastError") {
        return next(new BadRequestError("Invalid data"));
      }
      return next(err);
    });
};

module.exports = { login, createUser, getCurrentUser, updateUser };
