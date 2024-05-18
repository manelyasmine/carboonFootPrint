import mongoose from "mongoose";
const reportSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const report = mongoose.model("report", reportSchema);
export default report;
