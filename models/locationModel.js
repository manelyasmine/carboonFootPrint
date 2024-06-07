import mongoose from "mongoose";

const locationSchema = mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true }
});
 


const location = mongoose.model("location", locationSchema);
export default location;
