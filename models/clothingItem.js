const mongoose = require("mongoose");
const validator = require("validator");

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const clothingItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
    required: [true, "The weather field is required."],
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (value) => validator.isURL(value),
      message: "Link is not valid.",
    },
  },
  owner: {
    type: ObjectId,
    ref: "User",
    required: true,
  },
  likes: [
    {
      type: ObjectId,
      ref: "User",
      default: [],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = model("ClothingItem", clothingItemSchema);
