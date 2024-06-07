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
  BusinessField: {
    type: String,
    required: false,
  },
  HeadOffice: {
    type: String,
    required: false,
  },
  size:{
   type: Number,
     
    required:false,
  },
  logo: {
    type: String,
    required: true,
  },
<<<<<<< Updated upstream
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
 
  

=======
  description:{
    type: String,
    required: false,
  }
>>>>>>> Stashed changes
});

const company = mongoose.model("company", companySchema);
export default company;
