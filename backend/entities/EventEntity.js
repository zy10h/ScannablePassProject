import EventModel from "../models/Events.js";

class EventEntity {
  constructor(eventDoc) {
    this.id = eventDoc._id;
    this.title = eventDoc.title;
    this.description = eventDoc.description;
    this.location = eventDoc.location;
    this.date = eventDoc.date;
    this.time = eventDoc.time;
    this.category = eventDoc.category;
    this.availableSeats = eventDoc.availableSeats || 0;
    this.seatsFilled = eventDoc.seatsFilled || 0;
    this.registeredPeople = eventDoc.registeredPeople || [];
    this.attendees = eventDoc.attendees || [];
  }

  registerUser(userId) {
    if (this.seatsFilled >= this.availableSeats) throw new Error("Event full");
    if (this.registeredPeople.includes(userId)) throw new Error("Already registered");
    this.registeredPeople.push(userId);
    this.seatsFilled += 1;
  }

  markAttendance(userId) {
    if (!this.registeredPeople.includes(userId)) throw new Error("User not registered");
    if (this.attendees.includes(userId)) throw new Error("Already checked in");
    this.attendees.push(userId);
  }

  async save() {
    const eventDoc = await EventModel.findById(this.id);
    if (!eventDoc) throw new Error("Event not found");
    eventDoc.registeredPeople = this.registeredPeople;
    eventDoc.seatsFilled = this.seatsFilled;
    eventDoc.attendees = this.attendees;
    await eventDoc.save();
    return new EventEntity(eventDoc);
  }
}

export default EventEntity;
