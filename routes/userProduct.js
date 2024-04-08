const express = require("express");
const router = express.Router();
const userProductController = require("../controller/userProductController");

//get by category
router.get("/product/:category", userProductController.getByCategory);

//get by id
router.get("/product/get/:id", userProductController.getById);

module.exports = router;
