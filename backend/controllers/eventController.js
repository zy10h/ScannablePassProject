const Event = require("../models/Events");
const mongoose = require("mongoose");

exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      date,
      time,
      category,
      image,
      availableSeats,
      seatsFilled,
    } = req.body;

    const event = new Event({
      title,
      description,
      location,
      date,
      time,
      category,
      image,
      createdBy: req.user._id,
      availableSeats,
      seatsFilled,
    });

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create event", details: err.message });
  }
};

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("createdBy", "name email");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

exports.getEventById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const event = await Event.findById(id).populate("createdBy", "name email");
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

exports.updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update event", details: err.message });
  }
};

exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event ID" });
  }

  try {
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

exports.registerForEvent = async (req, res) => {
  const eventId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.seatsFilled >= event.availableSeats) {
      return res.status(400).json({ message: "Event is full" });
    }

    if (event.registeredPeople.includes(userId)) {
      return res.status(400).json({ message: "User already registered" });
    }

    event.seatsFilled += 1;
    event.registeredPeople.push(userId);

    await event.save();

    res.status(200).json({ message: "Registered successfully", event });
  } catch (err) {
    res.status(500).json({ message: "Failed to register", error: err.message });
  }
};
