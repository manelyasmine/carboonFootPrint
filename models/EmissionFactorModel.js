import mongoose from "mongoose";

const emissionFactorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  unit: { 
    type: String,
    required: true,
    
  },
  source: {
        type: String,
        required: true,
  } 
});




const emission= mongoose.model("emission", emissionFactorSchema);
export default emission;
