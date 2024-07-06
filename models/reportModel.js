import mongoose from "mongoose";

const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"], // Add other statuses as needed
      default: "pending",
    },
    downloadURL: {
      type: String,
      default: "",
    },
  },
  { timestamps: true } // This creates updatedAt field automatically
);

const report = mongoose.model("report", reportSchema);
export default report;
