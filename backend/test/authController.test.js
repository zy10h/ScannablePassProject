import chai from "chai";
import sinon from "sinon";
import User from "../models/User.js";
import AuthFacade from "../facades/AuthFacade.js";
import jwt from "jsonwebtoken";

const { expect } = chai;

describe("AuthFacade login", () => {
  afterEach(() => {
    sinon.restore();
  });

  it("should throw error if user not found", async () => {
    sinon
      .stub(User, "findOne")
      .returns({ select: sinon.stub().resolves(null) });
    try {
      await AuthFacade.login("nonexistent@test.com", "123456");
      throw new Error("Test should have thrown");
    } catch (err) {
      expect(err.message).to.equal("Invalid credentials");
    }
  });

  it("should return token and role when credentials are valid", async () => {
    const fakeUser = {
      email: "test@test.com",
      password: "hashedpassword",
      role: "user",
      id: "123",
      comparePassword: sinon.stub().resolves(true),
    };
    sinon
      .stub(User, "findOne")
      .returns({ select: sinon.stub().resolves(fakeUser) });
    const jwtStub = sinon.stub(jwt, "sign").callsFake(() => "fakeToken");
    const result = await AuthFacade.login("test@test.com", "123456");
    expect(result).to.have.property("token", "fakeToken");
    expect(result).to.have.property("role", "user");
    jwtStub.restore();
  });
});
