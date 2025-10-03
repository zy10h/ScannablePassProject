import express from "express";
import protect from "../middleware/authMiddleware.js";
import EventController from "../controllers/eventController.js";

const router = express.Router();

router.post("/createEvent", protect, EventController.createEvent);
router.get("/getAllEvents", EventController.getAllEvents);
router.get("/getById/:id", EventController.getEventById);
router.put("/edit-event/:id", protect, EventController.updateEvent);
router.delete("/delete-event/:id", protect, EventController.deleteEvent);
router.post("/register-for/:id", protect, EventController.registerForEvent);
router.get("/attendance", EventController.markAttendance);
router.get("/attendance/all", protect, EventController.getAllAttendance);
router.get("/:id/attendance", protect, EventController.getEventAttendance);

export default router;
