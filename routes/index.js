const express = require("express");
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

router.use("/items", itemRouter);

router.use("/users", auth, userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Router not found" });
});

module.exports = router;
