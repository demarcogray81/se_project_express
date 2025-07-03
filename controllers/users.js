const jwt = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

const {
  BAD_REQUEST,
  CONFLICT,
  UNAUTHORIZED,
  NOT_FOUND,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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
    .catch((err) => {
      const error = new Error(err.message);

      if (err.message === "Incorrect email or password") {
        error.statusCode = UNAUTHORIZED;
      }

      return next(error);
    });
};

const createUser = (req, res, next) => {
  const { name, email, password, avatar } = req.body;

  if (!password || password.length < 8) {
    const error = new Error("Password must be at least 8 characters long.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return bcrypt
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
      return res.status(201).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.code === 11000) {
        const conflictError = new Error(
          "A user with that email already exists."
        );
        conflictError.statusCode = CONFLICT;
        return next(conflictError);
      }

      if (error.name === "ValidationError") {
        const validationError = new Error(error.message);
        validationError.statusCode = BAD_REQUEST;
        return next(validationError);
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
    .then((user) => {
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      res.status(200).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        const castError = new Error("Invalid user ID format");
        castError.statusCode = BAD_REQUEST;
        return next(castError);
      }
      return next(error);
    });
};

const updateUser = (req, res, next) => {
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
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
      return Promise.reject(err);
    })

    .then((updatedUser) => {
      const userWithoutPassword = updatedUser.toObject();
      delete userWithoutPassword.password;
      return res.status(200).send(userWithoutPassword);
    })
    .catch((error) => {
      if (error.name === "ValidationError") {
        const validationError = new Error(error.message);
        validationError.statusCode = BAD_REQUEST;
        return next(validationError);
      }
      return next(error);
    });
};

module.exports = { createUser, getCurrentUser, updateUser, login };
