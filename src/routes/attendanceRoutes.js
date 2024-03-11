const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const authenticateToken = require("../middleware/authMiddleware");

router.use(authenticateToken);

router.post("/check", attendanceController.checkStudent);
router.post("/", attendanceController.markAttendance);

module.exports = router;
