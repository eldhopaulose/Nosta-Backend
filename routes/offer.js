const express = require("express");
const offerController = require("../controller/offerController");

const router = express.Router();

router.get("/", offerController.getOffers);

router.post("/", offerController.createOffer);

router.delete("/:id", offerController.deleteOffer);

module.exports = router;
