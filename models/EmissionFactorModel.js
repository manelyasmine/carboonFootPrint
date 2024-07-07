import mongoose from "mongoose";

const emissionFactorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  date: {
    type: String,
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
  sub_category: {
    type: String,
    //required: true,
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
  unit: {
    type: String,
  },
 
});




const emission= mongoose.model("emission", emissionFactorSchema);
export default emission;
