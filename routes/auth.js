const express = require("express");
const { celebrate, Joi } = require("celebrate");
const validator = require("validator");
const { login, createUser } = require("../controllers/users");

const router = express.Router();

const validateURL = (value, helpers) => {
  const ok = validator.isURL(value, {
    protocols: ["http", "https"],
    require_protocol: true,
    require_valid_protocol: true,
  });
  return ok ? value : helpers.message("Must be a valid http(s) URL");
};

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateURL),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);

module.exports = router;
