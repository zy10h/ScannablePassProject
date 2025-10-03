import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

class AuthFacade {
  static async register(data) {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = await User.create({ ...data, password: hashed });
    return AuthFacade.generateToken(user._id);
  }

  static async login(email) {
    const user = await User.findOne({ email }).select("+password");
    if (!user) throw new Error("Invalid credentials");

    const token = AuthFacade.generateToken(user._id);
    return { token, role: user.role };
  }

  static generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  }
}

export default AuthFacade;
