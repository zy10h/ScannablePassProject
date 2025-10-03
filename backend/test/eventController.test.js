import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { expect } from "chai";
import Event from "../models/Events.js";
import User from "../models/User.js";
import EventController from "../controllers/eventController.js";

describe("EventController (with Atlas)", function () {
  this.timeout(20000);

  before(async () => {
    mongoose.set("strictQuery", true);
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI not set. Please add your Atlas URI to .env");
    }
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
  });

  after(async () => {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.disconnect();
    }
  });

  afterEach(async () => {
    await Event.deleteMany();
    await User.deleteMany();
  });

  it("should create an event", async () => {
    const user = await User.create({
      name: "Test",
      email: "123456@test.com",
      password: "123456",
    });

    const req = {
      user: { _id: user._id },
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
