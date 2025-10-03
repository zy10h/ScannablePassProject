import mongoose from "mongoose";
import { expect } from "chai";
import Event from "../models/Events.js";
import User from "../models/User.js";
import EventController from "../controllers/eventController.js";

describe("EventController (with real Mongo)", () => {
  before(async () => {
    mongoose.set("strictQuery", true);
    await mongoose.connect("mongodb://127.0.0.1:27017/testdb", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Event.deleteMany();
    await User.deleteMany();
  });

  it("should create an event", async () => {
    const user = await User.create({
      name: "Test",
      email: "test@test.com",
      password: "123456",
    });

    const req = {
      user,
      body: {
        title: "My Event",
        description: "Desc",
        location: "Online",
        date: new Date(),
        time: "10:00",
      },
    };
    let resData;
    const res = {
      status: (code) => ({
        json: (data) => {
          resData = { code, data };
        },
      }),
    };

    await EventController.createEvent(req, res);

    expect(resData.code).to.equal(201);
    expect(resData.data.title).to.equal("My Event");
  });
});
