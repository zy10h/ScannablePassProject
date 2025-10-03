import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    status: { type: String, enum: ["present", "absent"], default: "present" },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

attendanceSchema.index({ user: 1, event: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
