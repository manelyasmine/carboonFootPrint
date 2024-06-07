import Role from "../models/roleModel.js"; // Assuming your role model
import fs from 'fs';// File system module
import user from "../models/userModel.js";
import mongoose from "mongoose";
// ... other imports and validation (if needed)

const createRole = async (req, res) => {
  const { name, userIds, permissionNames } = req.body; // Assuming 'userIds' is an array of user IDs

  try {
    // 1. Check if user IDs are provided
    if (!userIds || !userIds.length) {
      return res.status(400).json({ message: 'Please provide user IDs to assign the role' });
    }

    // 2. Find all valid users (optional but recommended)
    const users = await user.find({ _id: { $in: userIds } }); // Find users by IDs

    // 3. Create the new roleuse
    const newRole = await Role.create({ name, permissions: permissionNames,users:users });
    const updateResult = await user.updateMany({ _id: { $in: userIds } }, { role: newRole._id  });

 

    res.json({ message: 'Role created and assigned to users successfully', role: newRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating role' });
  }
};


const getRoles=async(req,res)=>{
 

  try{ 
    const rolesRes = await Role.find().populate({
      path: "users", // Assuming the field in Role that references users
      model: user, // User model to populate
      select: "-password -_role -__v  -updatedAt -createdAt", // Exclude password field from user data
    });
    res.json(rolesRes);
  }catch(e) {
    return res.status(400).json({ error: "Internal Server Error" });
  }
  
}

const updateRole = async (req, res) => {
  const { roleId, name, userIds, permissionNames } = req.body;

  try {
    if (!roleId) {
      return res.status(400).json({ message: 'Role ID is required' });
    }

    if (!name && !userIds && !permissionNames) {
      return res.status(400).json({ message: 'At least one update field is required (name, userIds, permissionNames)' });
    }
 const roleToUpdate = await Role.findById(roleId);
    if (!roleToUpdate) {
      return res.status(404).json({ message: 'Role not found' });
    }
    const updates = {};
    if (name) updates.name = name;
    if (permissionNames) updates.permissions = permissionNames;
    if (userIds) 
      {
        const users = await user.find({ _id: { $in: userIds } }); // Find users by IDs

        updates.users=users;
      }
    // 4. Update Role with Mongoose `findOneAndUpdate`
    const updatedRole = await Role.findOneAndUpdate(
      { _id: roleId },
      updates,
      { new: true } // Return the updated document
    );
    if (!updatedRole) {
      return res.status(500).json({ message: 'Error updating role' });
    }
 
    if (userIds) {
      const updatePromises = userIds.map(async (userId) => {
        const userToUpdate = await user.findByIdAndUpdate(userId, { role: roleId }, { new: true });
        
        if (!userToUpdate) {
          console.error(`Error updating user with ID: ${userId}`);
        }
      });
    
      await Promise.all(updatePromises);
    }
    

    res.json({ message: 'Role updated successfully', role: updatedRole });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating role' });
  }
};


const deleteRole = async (req, res) => {
  const roleId = req.params.id;
  try { 

    const userAdmin = await user.findById(req.body.user).select("-password");
  
    if (!req.params.id) {
      return res.status(400).json({ message: 'Role ID is required' });
    } 
    if (!userAdmin || !userAdmin.isAdmin) {
      return res.status(401).json({ message: 'Unauthorized to delete roles' });
    }
    const myRole = await Role.findById(roleId);
    if(myRole && userAdmin.isAdmin){
       const deletedRole = await Role.deleteOne({ _id: roleId });

       res.json({ message: 'Role deleted successfully' });
    }
    

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting role',"error":error });
  }
};



const detailsRole=async(req,res)=>{

}




export { createRole,getRoles ,updateRole,deleteRole,detailsRole} // ... other methods };
