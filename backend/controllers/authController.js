import AuthFacade from "../facades/AuthFacade.js";
import UserFactory from "../factories/UserFactory.js";
import QRCodeDecorator from "../decorators/QRCodeDecorator.js";
import User from "../models/User.js";

class UserController {
  static async register(req, res) {
    try {
      const token = await AuthFacade.register(req.body);
      res.status(201).json({ token });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }
      const { token, role } = await AuthFacade.login(email, password);
      res.status(200).json({ token, role });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const userEntity = UserFactory.createUser(req.user);
      res.json(userEntity.getProfile());
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateUserProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, university, address } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.university = university || user.university;
      user.address = address || user.address;

      const updatedUser = await user.save();
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        address: updatedUser.address,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async updateUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, university, address } = req.body;
      user.name = name || user.name;
      user.email = email || user.email;
      user.university = university || user.university;
      user.address = address || user.address;

      const updatedUser = await user.save();
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        university: updatedUser.university,
        address: updatedUser.address,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async deleteUser(req, res) {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await User.deleteOne({ _id: req.params.id });
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getAllProfiles(req, res) {
    try {
      const users = await User.find();
      const userData = users.map((user) => ({
        id: user._id,
        name: user.name,
        email: user.email,
        university: user.university,
        address: user.address,
      }));
      res.json(userData);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  static async getQRCode(req, res) {
    try {
      const decorator = new QRCodeDecorator(req.user);
      const qr = await decorator.generateQRCode();
      res.json({ qr });
    } catch (err) {
      res.status(500).json({
        message: "QR code generation failed",
        error: err.message,
      });
    }
  }
}

export default UserController;
