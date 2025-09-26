const express = require("express");
const { getCurrentUser, updateUser } = require("../controllers/users");
const { validateUpdateUserBody } = require("../middleware/validation");

const router = express.Router();

router.get("/users/me", getCurrentUser);
router.patch("/users/me", validateUpdateUserBody, updateUser);

module.exports = router;
