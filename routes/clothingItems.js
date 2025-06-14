const express = require("express");
const router = express.Router();

const {
  createItem,
  getItems,
  deleteItems,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItems);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);

module.exports = router;
