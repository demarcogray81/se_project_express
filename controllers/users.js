const bcrypt = require("bcryptjs");
const User = require("../models/user");
const {
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../utils/errors");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const validator = require("validator");

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error("Email and password are required.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  if (!validator.isEmail(email)) {
    const error = new Error("Invalid email format.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch(() => {
      const error = new Error("Incorrect email or password");
      error.statusCode = UNAUTHORIZED;
      next(error);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hashedPassword) =>
      User.create({
        name,
        email,
        password: hashedPassword,
        avatar,
      })
    )
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(201).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.code === 11000) {
        const err = new Error("A user with that email already exists.");
        err.statusCode = CONFLICT;
        return next(err);
      }

      if (error.name === "ValidationError") {
        const err = new Error(error.message);
        err.statusCode = BAD_REQUEST;
        return next(err);
      }

      return next(error);
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
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
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      const err = new Error("User not found");
      err.statusCode = NOT_FOUND;
      throw err;
    })
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        err.statusCode = BAD_REQUEST;
      }
      next(err);
    });
};

module.exports = { createUser, getCurrentUser, updateUser, login };
