const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const eventRoutes = require("./routes/eventRoutes.js");
const Database = require("./core/database.js");

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

  start() {
    new Database();

    this.app.listen(this.port, () =>
      console.log(`🚀 Server running on port ${this.port}`)
    );
  }
}

if (require.main === module) {
  const server = new Server();
  server.start();
}

module.exports = Server;
