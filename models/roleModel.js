import mongoose from "mongoose"; 

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  permissions: [
    {
      type: String, 
      required: true,
    },
  ],
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',  
  }],
});

const role = mongoose.model('Role', RoleSchema);

 
export default role;