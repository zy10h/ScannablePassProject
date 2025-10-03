import { expect } from "chai";
import sinon from "sinon";
import AdminProxy from "../proxies/AdminProxy.js";

describe("AdminProxy", () => {
  let adminService;
  let proxy;

  beforeEach(() => {
    adminService = {
      deleteUser: sinon.stub().resolves("User deleted"),
      updateSettings: sinon.stub().resolves("Settings updated"),
    };
    proxy = new AdminProxy(adminService);
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should allow admin user to execute action", async () => {
    const adminUser = { role: "admin" };
    const result = await proxy.execute(adminUser, "deleteUser", "user123");

    expect(result).to.equal("User deleted");
    expect(adminService.deleteUser.calledOnceWith("user123")).to.be.true;
  });

  it("should throw error for non-admin user", async () => {
    const normalUser = { role: "user" };

    try {
      await proxy.execute(normalUser, "deleteUser", "user123");
      throw new Error("Test failed: error was not thrown");
    } catch (err) {
      expect(err.message).to.equal("Unauthorized: Admins only");
    }
  });

  it("should call the correct method with arguments", async () => {
    const adminUser = { role: "admin" };
    const result = await proxy.execute(adminUser, "updateSettings", {
      theme: "dark",
    });

    expect(result).to.equal("Settings updated");
    expect(adminService.updateSettings.calledOnceWith({ theme: "dark" })).to.be
      .true;
  });
});
