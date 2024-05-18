import mongoose from "mongoose";
const companySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  website: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const company = mongoose.model("company", companySchema);
export default company;
