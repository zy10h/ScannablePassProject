import { expect } from "chai";
import sinon from "sinon";
import jwt from "jsonwebtoken";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

describe("protect middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should call next() and attach user if token is valid", async () => {
    req.headers.authorization = "Bearer validtoken";

    sinon.stub(jwt, "verify").returns({ id: "123" });

    // Mock chainable findById().select()
    const selectStub = sinon.stub().resolves({ _id: "123", name: "Test User" });
    sinon.stub(User, "findById").returns({ select: selectStub });

    await protect(req, res, next);

    expect(req.user).to.deep.equal({ _id: "123", name: "Test User" });
    expect(next.calledOnce).to.be.true;
  });

  it("should return 401 if user not found", async () => {
    req.headers.authorization = "Bearer validtoken";

    sinon.stub(jwt, "verify").returns({ id: "123" });
    
    const selectStub = sinon.stub().resolves(null);
    sinon.stub(User, "findById").returns({ select: selectStub });

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "User not found" })).to.be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should return 401 if token is invalid", async () => {
    req.headers.authorization = "Bearer invalidtoken";

    sinon.stub(jwt, "verify").throws(new Error("invalid token"));

    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Not authorized, token invalid" })).to
      .be.true;
    expect(next.notCalled).to.be.true;
  });

  it("should return 401 if no token provided", async () => {
    await protect(req, res, next);

    expect(res.status.calledWith(401)).to.be.true;
    expect(res.json.calledWith({ message: "Not authorized, no token" })).to.be
      .true;
    expect(next.notCalled).to.be.true;
  });
});
