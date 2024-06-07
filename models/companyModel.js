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
  business:{
    type:String,
    required:true,
  },
  headOffice:{
    type:String,
    required:false,
  },
  size:{
    type:Number,
    required:false,

  },
  description:{
    type:String,
    required:false,
  }, 
  locations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'location',  
  }],
 
  

});

const company = mongoose.model("company", companySchema);
export default company;
