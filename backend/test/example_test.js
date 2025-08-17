const chai = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");
const Event = require("../models/Events");
const eventController = require("../controllers/eventController");

const { expect } = chai;

describe("Event Controller Tests", () => {
  afterEach(() => {
    sinon.restore(); // cleanup stubs after each test
  });

  describe("createEvent", () => {
    it("should create a new event successfully", async () => {
      const req = {
        user: { _id: new mongoose.Types.ObjectId() },
        body: {
          title: "New Event",
          description: "Event Description",
          location: "Campus Hall",
          date: "2025-10-10",
          time: "10:00 AM",
          category: "Workshop",
          image: "event.jpg",
          availableSeats: 100,
          seatsFilled: 0,
        },
      };

      const savedEvent = { ...req.body, _id: new mongoose.Types.ObjectId() };

      const saveStub = sinon.stub().resolves(savedEvent);
      sinon.stub(Event.prototype, "save").callsFake(saveStub);

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await eventController.createEvent(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(savedEvent)).to.be.true;
    });

    it("should return 500 if save fails", async () => {
      sinon.stub(Event.prototype, "save").throws(new Error("DB Error"));

      const req = {
        user: { _id: new mongoose.Types.ObjectId() },
        body: { title: "Fail Event" },
      };
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await eventController.createEvent(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWithMatch({ error: "Failed to create event" })).to.be
        .true;
    });
  });

  describe("getAllEvents", () => {
    it("should return all events", async () => {
      const events = [{ title: "Event 1" }, { title: "Event 2" }];
      sinon.stub(Event, "find").returns({ populate: sinon.stub().resolves(events) });

      const req = {};
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.getAllEvents(req, res);

      expect(res.json.calledWith(events)).to.be.true;
    });

    it("should return 500 on error", async () => {
      sinon.stub(Event, "find").throws(new Error("DB Error"));
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.getAllEvents({}, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });

  describe("getEventById", () => {
    it("should return event by ID", async () => {
      const event = { title: "Test Event" };
      sinon.stub(Event, "findById").returns({ populate: sinon.stub().resolves(event) });

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.getEventById(req, res);

      expect(res.json.calledWith(event)).to.be.true;
    });

    it("should return 404 if event not found", async () => {
      sinon.stub(Event, "findById").returns({ populate: sinon.stub().resolves(null) });

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.getEventById(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("updateEvent", () => {
    it("should update event", async () => {
      const updatedEvent = { title: "Updated Event" };
      sinon.stub(Event, "findByIdAndUpdate").resolves(updatedEvent);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: { title: "Updated Event" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.updateEvent(req, res);

      expect(res.json.calledWith(updatedEvent)).to.be.true;
    });

    it("should return 404 if event not found", async () => {
      sinon.stub(Event, "findByIdAndUpdate").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: {} };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.updateEvent(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("deleteEvent", () => {
    it("should delete event", async () => {
      const deletedEvent = { title: "Deleted" };
      sinon.stub(Event, "findByIdAndDelete").resolves(deletedEvent);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.deleteEvent(req, res);

      expect(res.json.calledWith({ message: "Event deleted successfully" })).to.be.true;
    });

    it("should return 404 if not found", async () => {
      sinon.stub(Event, "findByIdAndDelete").resolves(null);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.deleteEvent(req, res);

      expect(res.status.calledWith(404)).to.be.true;
    });
  });

  describe("registerForEvent", () => {
    it("should register user if seats available", async () => {
      const event = {
        seatsFilled: 0,
        availableSeats: 5,
        registeredPeople: [],
        save: sinon.stub().resolvesThis(),
      };
      sinon.stub(Event, "findById").resolves(event);

      const req = { params: { id: new mongoose.Types.ObjectId().toString() }, body: { userId: "user123" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.registerForEvent(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(res.json.calledWithMatch({ message: "Registered successfully" })).to.be.true;
    });

    it("should reject if event full", async () => {
      const event = { seatsFilled: 5, availableSeats: 5, registeredPeople: [] };
      sinon.stub(Event, "findById").resolves(event);

      const req = { params: { id: "eventId" }, body: { userId: "user123" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.registerForEvent(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });

    it("should reject if already registered", async () => {
      const event = { seatsFilled: 1, availableSeats: 5, registeredPeople: ["user123"] };
      sinon.stub(Event, "findById").resolves(event);

      const req = { params: { id: "eventId" }, body: { userId: "user123" } };
      const res = { json: sinon.spy(), status: sinon.stub().returnsThis() };

      await eventController.registerForEvent(req, res);

      expect(res.status.calledWith(400)).to.be.true;
    });
  });
});
