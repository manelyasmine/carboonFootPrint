import mongoose from "mongoose";
const dataSchema = mongoose.Schema({
  date: {
    type: Date,
    //required: true,
  },

  location: {
    type: String,
   // required: true,
  },
  category: {
    type: String,
    //required: true,
    ref: "user",
  },
  quantity: {
    type: String,
    //required: true,
    default: "0",
  },
  emission_tracker: {
    type: String,
    //required: true,
  },
  source: {
    type: String,
    //required: true,
  },
  scope1: {
    type: Number,
    //required: true,
  },
  scope2: {
    type: Number,
    //required: true,
  },
  scope3: {
    type: Number,
    //required: true,
  },
  // integration: {
  //   type: String,
  //   required: true,
  // },
});

const data = mongoose.model("data", dataSchema);
export default data;
