// Using OOP principles to create user entities with methods for profile retrieval and role-based permissions.

class UserEntity {
  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.university = user.university;
    this.address = user.address;
  }

  getProfile() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      university: this.university,
      address: this.address,
    };
  }
}

class AdminEntity extends UserEntity {
  constructor(user) {
    super(user);
  }

  canManageEvents() {
    return this.role === "admin";
  }
}

export { UserEntity, AdminEntity };
