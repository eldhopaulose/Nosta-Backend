const express = require("express");

const requireUserAuth = require("../middleware/requireUserAuth");
const likeController = require("../controller/likeController");

const router = express.Router();

router.use(requireUserAuth);

router.post("/like/:id", likeController.addLike);
router.post("/unlike/:id", likeController.removeLike);
router.get("/likes", likeController.getLikes);
router.get("/likes-full-details", likeController.getLikesFullDetails);

module.exports = router;
