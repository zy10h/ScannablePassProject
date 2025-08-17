const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const { protect } = require("../middleware/authMiddleware");

router.post("/createEvent", protect, eventController.createEvent);
router.get("/getAllEvents", eventController.getAllEvents);
router.get("/getById/:id", eventController.getEventById);
router.put("/edit-event/:id", protect, eventController.updateEvent);
router.delete("/delete-event/:id", protect, eventController.deleteEvent);
router.post("/register-for/:id", protect, eventController.registerForEvent);

module.exports = router;
