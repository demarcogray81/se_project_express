const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minlength: [2, "Name must be at least 2 characters long."],
      maxlength: [30, "Name must be no more than 30 characters long."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validate: {
        validator: (v) => validator.isEmail(v),
        message: "Invalid email.",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      select: false, // don't return hash by default
    },
    avatar: {
      type: String,
      default: "",
      validate: {
        validator: (v) => !v || validator.isURL(v, { require_protocol: true }),
        message: "Avatar must be a valid URL",
      },
    },
  },
  { timestamps: true }
);

// for login
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        return user;
      });
    });
};

module.exports = mongoose.model("User", userSchema);
