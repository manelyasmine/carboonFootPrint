import mongoose from "mongoose"; 


const PermissionSchema = new mongoose.Schema({
  resource: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  // Add additional fields if needed (e.g., description, scope)
});

const permission= mongoose.model('Permission', PermissionSchema);
export default permission;