import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
mongoose.set("strictQuery", true); // suppress warning

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    Database.instance = this;
  }

  async connect() {
    if (this.connection) return this.connection; // already connected
    try {
      this.connection = await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("✅ MongoDB Connected");
      return this.connection;
    } catch (err) {
      console.error("❌ MongoDB Connection Error:", err);
      throw err;
    }
  }

  async disconnect() {
    if (!this.connection) return;
    await mongoose.disconnect();
    this.connection = null;
    console.log("🛑 MongoDB Disconnected");
  }
}

export default new Database();
