const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.post("/createEvent", protect, eventController.createEvent);
router.get("/getAllEvents", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.put("/:id", protect, eventController.updateEvent);
router.delete("/:id", protect, eventController.deleteEvent);
router.post("/register/:id", protect, eventController.registerForEvent);

module.exports = router;
