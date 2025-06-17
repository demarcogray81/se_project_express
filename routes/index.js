const express = require("express");
const { NOT_FOUND } = require("../utils/errors");

const router = express.Router();
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", itemRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Router not found" });
});

module.exports = router;
