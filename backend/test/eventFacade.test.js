import { expect } from "chai";
import sinon from "sinon";
import EventFacade from "../facades/EventFacade.js";
import Event from "../models/Events.js";
import User from "../models/User.js";
import Attendance from "../models/Attendance.js";

describe("EventFacade", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("createEvent", () => {
    it("should create and save a new event", async () => {
      const user = { _id: "user123" };
      const data = { title: "Test Event", availableSeats: 10 };
      const saveStub = sandbox.stub().resolves({ _id: "event123", ...data });

      sandbox.stub(Event.prototype, "save").callsFake(saveStub);

      const event = await EventFacade.createEvent(user, data);

      expect(event._id).to.equal("event123");
      expect(saveStub.calledOnce).to.be.true;
    });
  });

  describe("getAllEvents", () => {
    it("should return all events", async () => {
      const fakeEvents = [{ title: "Event1" }, { title: "Event2" }];
      sandbox.stub(Event, "find").returns({
        populate: sandbox.stub().resolves(fakeEvents),
      });

      const events = await EventFacade.getAllEvents();
      expect(events).to.deep.equal(fakeEvents);
    });
  });

  describe("getEventById", () => {
    it("should return event by id", async () => {
      const fakeEvent = { _id: "event123", title: "Event" };
      sandbox.stub(Event, "findById").returns({
        populate: sandbox.stub().resolves(fakeEvent),
      });

      const event = await EventFacade.getEventById("event123");
      expect(event).to.deep.equal(fakeEvent);
    });
  });

  describe("updateEvent", () => {
    it("should update event and return new one", async () => {
      const fakeEvent = { _id: "event123", title: "Updated Event" };
      sandbox.stub(Event, "findByIdAndUpdate").resolves(fakeEvent);

      const result = await EventFacade.updateEvent("event123", {
        title: "Updated Event",
      });
      expect(result.title).to.equal("Updated Event");
    });
  });

  describe("deleteEvent", () => {
    it("should delete event by id", async () => {
      sandbox.stub(Event, "findByIdAndDelete").resolves({ _id: "event123" });

      const result = await EventFacade.deleteEvent("event123");
      expect(result._id).to.equal("event123");
    });
  });

  describe("registerForEvent", () => {
    it("should register user for event", async () => {
      const fakeEvent = {
        _id: "event123",
        seatsFilled: 0,
        availableSeats: 2,
        registeredPeople: [],
        save: sandbox.stub().resolvesThis(),
      };

      sandbox.stub(Event, "findById").resolves(fakeEvent);

      const result = await EventFacade.registerForEvent("event123", "user123");
      expect(result.registeredPeople).to.include("user123");
      expect(result.seatsFilled).to.equal(1);
    });

    it("should throw if event not found", async () => {
      sandbox.stub(Event, "findById").resolves(null);

      try {
        await EventFacade.registerForEvent("badId", "user123");
        throw new Error("Expected error");
      } catch (err) {
        expect(err.message).to.equal("Event not found");
      }
    });
  });

  describe("markAttendance", () => {
    it("should mark attendance for a valid user and event", async () => {
      const fakeEvent = {
        _id: "event123",
        title: "Event",
        date: "2025",
        location: "Lahore",
      };
      const fakeUser = { _id: "user123", email: "test@example.com" };
      const fakeAttendance = { save: sandbox.stub().resolvesThis() };

      sandbox.stub(Event, "findById").resolves(fakeEvent);
      sandbox.stub(User, "findOne").resolves(fakeUser);
      sandbox.stub(Attendance, "findOne").resolves(null);
      sandbox.stub(Attendance.prototype, "save").callsFake(fakeAttendance.save);

      const result = await EventFacade.markAttendance({
        userId: "user123",
        email: "test@example.com",
        eventId: "event123",
      });

      expect(result._id).to.equal("event123");
      expect(result.title).to.equal("Event");
    });

    it("should throw if attendance already exists", async () => {
      sandbox.stub(Event, "findById").resolves({ _id: "event123" });
      sandbox.stub(User, "findOne").resolves({ _id: "user123" });
      sandbox.stub(Attendance, "findOne").resolves({ _id: "att1" });

      try {
        await EventFacade.markAttendance({
          userId: "user123",
          email: "test@example.com",
          eventId: "event123",
        });
        throw new Error("Expected error");
      } catch (err) {
        expect(err.message).to.equal("Attendance already marked");
      }
    });
  });

  describe("getEventAttendance", () => {
    it("should return event attendance with populated user", async () => {
      const fakeAttendance = [
        { user: { name: "Taha", email: "taha@test.com" } },
      ];
      sandbox.stub(Attendance, "find").returns({
        populate: sandbox.stub().resolves(fakeAttendance),
      });

      const result = await EventFacade.getEventAttendance("event123");
      expect(result).to.deep.equal(fakeAttendance);
    });
  });

  describe("getAllAttendance", () => {
    it("should return mapped attendance records", async () => {
      const fakeAttendance = [
        {
          user: { name: "Taha", email: "taha@test.com" },
          event: { title: "Event1", date: "2025" },
          present: true,
          date: "2025-01-01",
        },
      ];

      sandbox.stub(Attendance, "find").returns({
        populate: sandbox
          .stub()
          .onFirstCall()
          .returnsThis()
          .onSecondCall()
          .resolves(fakeAttendance),
      });

      const result = await EventFacade.getAllAttendance();
      expect(result[0]).to.deep.equal({
        name: "Taha",
        email: "taha@test.com",
        eventTitle: "Event1",
        attendance: "Present",
        date: "2025-01-01",
      });
    });
  });
});
