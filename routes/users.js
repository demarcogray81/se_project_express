const express = require("express");

const router = express.Router();
const { getCurrentUser, updateUser } = require("../controllers/users");

router.get("/me", getCurrentUser);
router.patch("/me", updateUser);

module.exports = router;
