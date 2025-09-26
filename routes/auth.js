const router = require("express").Router();
const { login, createUser } = require("../controllers/users");
const {
  validateLoginBody,
  validateSignupBody,
} = require("../middleware/validation");

router.post("/signin", validateLoginBody, login);
router.post("/signup", validateSignupBody, createUser);

module.exports = router;
