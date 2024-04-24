const express = require("express");
const requireUserAuth = require("../middleware/requireUserAuth");

const orderController = require("../controller/orderController");

const router = express.Router();

router.post("/", requireUserAuth, orderController.orderPlaced);
router.get("/", orderController.getAllOrders);

module.exports = router;
