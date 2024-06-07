import mongoose from "mongoose"; 


const UserRoleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', // Replace with your User model reference
  },
  role: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role',
  },
});

const userRole = mongoose.model('UserRole', UserRoleSchema);

export default UserRole;