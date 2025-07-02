const mongoose = require("mongoose");
const validator = require("validator");

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const clothingItemSchema = new Schema({
  name: {
    type: String,
    required: [true, "Item name is required"],
    minlength: [2, "Name must be at least 2 characters"],
    maxlength: [30, "Name must be less than 30 characters"],
  },
  weather: {
    type: String,
    required: [true, "Weather type is required"],
    enum: ["hot", "warm", "cold"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (url) => validator.isURL(url),
      message: "Invalid URL format",
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
