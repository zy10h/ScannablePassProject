//  this is Proxy Pattern to control access to admin functionalities.

class AdminProxy {
  constructor(adminService) {
    this.adminService = adminService;
  }

  async execute(user, action, ...args) {
    if (user.role !== "admin") {
      throw new Error("Unauthorized: Admins only");
    }
    return this.adminService[action](...args);
  }
}

module.exports = AdminProxy;