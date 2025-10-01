// factories is a directory for factory classes that create instances of entities or services based on specific criteria or configurations.
// use factory pattern to encapsulate the logic of object creation, promoting code reusability and maintainability.

const { UserEntity, AdminEntity } = require("../entities/UserEntity");

class UserFactory {
  static createUser(userDoc) {
    if (userDoc.role === "admin") {
      return new AdminEntity(userDoc);
    }
    return new UserEntity(userDoc);
  }
}

module.exports = UserFactory;