const express = require("express");
const EventController = require("../controllers/EventController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/createEvent", protect, EventController.createEvent);
router.get("/getAllEvents", EventController.getAllEvents);
router.get("/getById/:id", EventController.getEventById);
router.put("/edit-event/:id", protect, EventController.updateEvent);
router.delete("/delete-event/:id", protect, EventController.deleteEvent);
router.post("/register-for/:id", protect, EventController.registerForEvent);
router.post("/attend", EventController.markAttendance);
router.get("/:id/attendance", EventController.getEventAttendance);

module.exports = router;
