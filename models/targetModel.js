import mongoose from "mongoose";
const targetSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
  emissionReduction: { 
    type: Number,
    required: true,
    min: 0,
    max: 90,
  },
  baseYear: {
        type: Number,
        required: true,
  },
  targetYear: {
        type: Number,
        required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // Set the default value to current timestamp
  },

  updatedAt: {
    type: Date,
    default: Date.now, // Set the default value to current timestamp
  },
});
targetSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


const target = mongoose.model("target", targetSchema);
export default target;
