import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import Database from "./core/Database.js";

dotenv.config();

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 5001;

    this._middlewares();
    this._routes();
  }

  _middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  _routes() {
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/event", eventRoutes);
  }

  async start() {
    try {
      await Database.connect();
      this.app.listen(this.port, () =>
        console.log(`🚀 Server running on port ${this.port}`)
      );
    } catch (err) {
      console.error("Failed to start server due to DB error:", err);
      process.exit(1);
    }
  }
}

export default Server;


