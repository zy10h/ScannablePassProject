// this is singleton pattern to ensure only one instance of the database connection is created.

const mongoose = require("mongoose");

class Database {
  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this._connect();
    Database.instance = this;
  }

  _connect() {
    mongoose
      .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("✅ MongoDB Connected"))
      .catch((err) => console.error("❌ MongoDB Error:", err.message));
  }
}

module.exports = Database;
