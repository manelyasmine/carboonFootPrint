import mongoose from "mongoose";
const dataSchema = mongoose.Schema({
  date: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    ref: "user",
  },
  quantity: {
    type: String,
    required: true,
    default: "0",
  },
  emission_tracker: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  // integration: {
  //   type: String,
  //   required: true,
  // },
});

const data = mongoose.model("data", dataSchema);
export default data;
