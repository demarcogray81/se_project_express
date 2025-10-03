const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const auth = require("../middlewares/auth");
const NotFoundError = require("../errors/NotFoundError");

const router = express.Router();

// Mount auth routes first
router.use(authRouter);

// Public items routes
router.use("/items", itemRouter);

// Protected users routes
router.use("/users", auth, userRouter);

// Catch-all -> centralized error handler
router.use("*", (req, res, next) => next(new NotFoundError("Route not found")));

module.exports = router;
