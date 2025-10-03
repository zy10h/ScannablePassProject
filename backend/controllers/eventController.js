import EventFacade from "../facades/EventFacade.js";
import QRCodeDecorator from "../decorators/QRCodeDecorator.js";

class EventController {
  static async createEvent(req, res) {
    try {
      const event = await EventFacade.createEvent(req.user, req.body);
      res.status(201).json(event);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getAllEvents(req, res) {
    try {
      const events = await EventFacade.getAllEvents();
      res.json(events);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getEventById(req, res) {
    try {
      const event = await EventFacade.getEventById(req.params.id);
      if (!event) return res.status(404).json({ error: "Event not found" });
      res.json(event);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async updateEvent(req, res) {
    try {
      const updated = await EventFacade.updateEvent(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Event not found" });
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteEvent(req, res) {
    try {
      const deleted = await EventFacade.deleteEvent(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Event not found" });
      res.json({ message: "Event deleted successfully" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async registerForEvent(req, res) {
    try {
      const event = await EventFacade.registerForEvent(
        req.params.id,
        req.user._id
      );

      const decorator = new QRCodeDecorator(req.user, req.params.id);
      const qrImage = await decorator.generateQRCode();

      res.json({ event, qrCode: qrImage });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async markAttendance(req, res) {
    try {
      const { id: userId, email, eventId } = req.query;
      if (!userId || !email || !eventId)
        return res.status(400).json({ error: "Invalid QR code data" });

      const event = await EventFacade.markAttendance({
        userId,
        email,
        eventId,
      });

      res.json({
        message: "Attendance marked successfully",
        attendee: { id: userId, email },
        event,
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getEventAttendance(req, res) {
    try {
      const attendance = await EventFacade.getEventAttendance(req.params.id);
      if (!attendance) {
        return res.status(404).json({ error: "Attendance not found" });
      }
      // example if you want event name
      const eventName = attendance.event?.name || "Unknown Event";
      res.json({ attendance, eventName });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

static async getAllAttendance(req, res) {
  try {
    console.log("Fetching all attendance...");
    const data = await EventFacade.getAllAttendance();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No attendance records found" });
    }

    const filteredData = data.filter(record => record && record.name && record.email);

    res.json(filteredData);
  } catch (err) {
    console.error("Error in getAllAttendance:", err);
    res.status(500).json({ error: err.message });
  }
}

}

export default EventController;
