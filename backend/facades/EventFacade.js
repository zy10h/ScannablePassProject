import Event from "../models/Events.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

class EventFacade {
  static async createEvent(user, data) {
    const event = new Event({
      ...data,
      createdBy: user._id,
      registeredPeople: [],
      seatsFilled: 0,
    });
    return await event.save();
  }

  static async getAllEvents() {
    return await Event.find().populate("createdBy", "name email");
  }

  static async getEventById(id) {
    return await Event.findById(id).populate("createdBy", "name email");
  }

  static async updateEvent(id, data) {
    return await Event.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  static async deleteEvent(id) {
    return await Event.findByIdAndDelete(id);
  }

  static async registerForEvent(eventId, userId) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");
    if (event.seatsFilled >= event.availableSeats)
      throw new Error("Event is full");
    if (event.registeredPeople.includes(userId))
      throw new Error("Already registered");

    event.registeredPeople.push(userId);
    event.seatsFilled += 1;
    await event.save();
    return event;
  }

  static async markAttendance({ userId, email, eventId }) {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    const user = await User.findOne({ _id: userId, email });
    if (!user) throw new Error("User not found");
    const existing = await Attendance.findOne({
      user: user._id,
      event: event._id,
    });
    if (existing) throw new Error("Attendance already marked");

    const attendance = new Attendance({ user: user._id, event: event._id });
    await attendance.save();

    return {
      _id: event._id,
      title: event.title,
      date: event.date,
      location: event.location,
    };
  }

  static async getEventAttendance(eventId) {
    const attendance = await Attendance.find({ event: eventId }).populate(
      "user",
      "name email"
    );
    return attendance;
  }

  static async getAllAttendance() {
    try {
      const attendanceRecords = await Attendance.find()
        .populate("user", "name email")
        .populate("event", "title");

      return attendanceRecords.map((rec) => ({
        name: rec.user?.name || "Unknown",
        email: rec.user?.email || "Unknown",
        eventTitle: rec.event?.title || "Unknown",
        date: rec.date,
        attendance: rec.present ? "Present" : "Absent",
      }));
    } catch (err) {
      console.error("Error fetching attendance:", err);
      throw err;
    }
  }
}

export default EventFacade;
