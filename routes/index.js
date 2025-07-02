const express = require("express");
const { NOT_FOUND } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);

if (process.env.NODE_ENV === "test") {
  router.use((req, res, next) => {
    console.log("🧪 Injecting test user");
    req.user = {
      _id: "5d8b8592978f8bd833ca8133",
    };
    next();
  });
}

router.use(auth);

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Router not found" });
});

module.exports = router;
