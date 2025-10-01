// useing Facade Pattern to simplify authentication processes.

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");

class AuthFacade {
  static async register(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashed });
    return AuthFacade.generateToken(user._id);
  }

  static async login(email, password) {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Invalid credentials");
    return AuthFacade.generateToken(user._id);
  }

  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  }
}

module.exports = AuthFacade;