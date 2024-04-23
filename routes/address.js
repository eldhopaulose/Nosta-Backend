const express = require("express");

const requireUserAuth = require("../middleware/requireUserAuth");

const adressController = require("../controller/addressController");

const router = express.Router();

router.use(requireUserAuth);

router.post("/", adressController.addressCreate);

router.get("/", adressController.addressGet);

router.delete("/:id", adressController.addressDelete);

router.put("/:id", adressController.addressUpdate);

module.exports = router;
