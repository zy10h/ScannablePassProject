const Event = require("../models/Events");

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

  static async markAttendance(qrData) {
    const data = JSON.parse(qrData);
    const { id: userId, eventId } = data;

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (!event.attendance) event.attendance = [];
    if (event.attendance.includes(userId))
      throw new Error("User already marked attendance");

    event.attendance.push(userId);
    await event.save();
    return event;
  }

  static async getEventAttendance(eventId) {
    const event = await Event.findById(eventId).populate(
      "registeredPeople",
      "name email"
    );
    if (!event) throw new Error("Event not found");
    return event.registeredPeople;
  }
}

module.exports = EventFacade;
