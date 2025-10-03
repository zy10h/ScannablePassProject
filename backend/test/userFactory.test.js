import { expect } from "chai";
import sinon from "sinon";
import UserFactory from "../factories/UserFactory.js";
import { UserEntity, AdminEntity } from "../entities/UserEntity.js";

describe("UserFactory", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should return AdminEntity when role is admin", () => {
    const userDoc = { _id: "1", name: "Admin User", role: "admin" };

    const user = UserFactory.createUser(userDoc);

    expect(user).to.be.instanceOf(AdminEntity);
    expect(user.name).to.equal("Admin User");
  });

  it("should return UserEntity when role is not admin", () => {
    const userDoc = { _id: "2", name: "Normal User", role: "user" };

    const user = UserFactory.createUser(userDoc);

    expect(user).to.be.instanceOf(UserEntity);
    expect(user.name).to.equal("Normal User");
  });

  it("should handle missing role and default to UserEntity", () => {
    const userDoc = { _id: "3", name: "No Role User" };

    const user = UserFactory.createUser(userDoc);

    expect(user).to.be.instanceOf(UserEntity);
    expect(user.name).to.equal("No Role User");
  });
});
