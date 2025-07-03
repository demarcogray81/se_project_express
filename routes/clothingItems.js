const express = require("express");
const {
  createItem,
  getItems,
  deleteItems,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const auth = require("../middlewares/auth");

const router = express.Router();

router.get("/", getItems);

router.post("/", auth, createItem);
router.delete("/:itemId", auth, deleteItems);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);

module.exports = router;
