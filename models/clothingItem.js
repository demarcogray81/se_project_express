const mongoose = require("mongoose");
const validator = require("validator");

const { Schema, model } = mongoose;
const { ObjectId } = Schema.Types;

const clothingItemSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [30, "Name must be less than 30 characters"],
    },
    weather: {
      type: String,
      required: [true, "Weather type is required"],
      enum: {
        values: ["hot", "warm", "cold"],
        message: "Weather must be hot, warm, or cold",
      },
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
      validate: {
        validator: (v) => validator.isURL(v, { require_protocol: true }),
        message: "Image URL must be a valid URL",
      },
    },
    owner: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    likes: {
      type: [ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = model("ClothingItem", clothingItemSchema);
