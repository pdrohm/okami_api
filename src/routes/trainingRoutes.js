const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingController");
// const authenticateToken = require("../middleware/authMiddleware");

// router.use(authenticateToken);

router.post("/", trainingController.createTraining);

router.get("/", trainingController.getAllTrainings);

router.get(
  "/:trainingId/attendances",
  trainingController.getAttendancesByTraining
);

router.get("/:id", trainingController.getTrainingById);

router.put("/:id", trainingController.updateTraining);

router.delete("/:id", trainingController.deleteTraining);

router.get("/training-days", trainingController.getDaysWithTraining);

module.exports = router;
