import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AuthFacade from "../facades/AuthFacade.js";
import User from "../models/User.js";

process.env.JWT_SECRET = "testsecret";

describe("AuthFacade", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("register", () => {
    it("should hash password, create user, and return token", async () => {
      const fakeUser = { _id: "12345" };
      const data = { email: "test@example.com", password: "plainPass" };

      sandbox.stub(bcrypt, "hash").resolves("hashedPass");
      sandbox.stub(User, "create").resolves(fakeUser);
      sandbox.stub(jwt, "sign").returns("fakeToken");

      const token = await AuthFacade.register(data);

      expect(token).to.equal("fakeToken");
    });
  });

  describe("login", () => {
    it("should throw error if user not found", async () => {
      sandbox
        .stub(User, "findOne")
        .returns({ select: sinon.stub().resolves(null) });

      try {
        await AuthFacade.login("notfound@example.com");
        throw new Error("Expected error was not thrown");
      } catch (err) {
        expect(err.message).to.equal("Invalid credentials");
      }
    });

    it("should return token and role when user exists", async () => {
      const fakeUser = {
        _id: "123",
        email: "test@example.com",
        role: "admin",
      };
      sandbox
        .stub(User, "findOne")
        .returns({ select: sinon.stub().resolves(fakeUser) });
      sandbox.stub(jwt, "sign").returns("fakeToken");

      const result = await AuthFacade.login("test@example.com");

      expect(result).to.deep.equal({ token: "fakeToken", role: "admin" });
    });
  });

  describe("generateToken", () => {
    it("should call jwt.sign and return token", () => {
      sandbox.stub(jwt, "sign").returns("signedToken");
      const token = AuthFacade.generateToken("123");
      expect(token).to.equal("signedToken");
    });
  });
});
