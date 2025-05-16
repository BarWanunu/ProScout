const express = require("express");
const router = express.Router();
const recommendationController = require("../controller/recommendationController");
const auth = require("../middleware/auth");

router.post("/", auth, recommendationController.createRecommendation);
router.delete("/:id", auth, recommendationController.deleteRecommendation);
router.get(
  "/player/:player_id",
  auth,
  recommendationController.getRecommendationByPlayerId
);
router.get("/team", auth, recommendationController.getRecommendationsByTeam);
router.get("/scout", auth, recommendationController.getRecommendationsByScout);

module.exports = router;
