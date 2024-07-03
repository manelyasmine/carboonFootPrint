import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user", // Replace with your User model reference
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["SENT", "SEEN"],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  }
});

const notification = mongoose.model("notification", NotificationSchema);

export default notification;
