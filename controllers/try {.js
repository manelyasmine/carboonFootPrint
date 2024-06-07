 try {
    user=await user.findById(userId);
    if (!user.isAdmin) {
      return res.status(401).json({ message: 'Unauthorized to delete roles' });
    }
 const roleToDelete = await Role.findById(roleId);
    if (!roleToDelete) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // 3. Check for Assigned Users (Optional, adjust based on your needs)
    const usersWithRole = await user.find({ role: roleId });
    if (usersWithRole.length > 0) {
      return res.status(400).json({ message: 'Cannot delete role with assigned users. Reassign users first.' });
    }

    // 4. Check for Admin Users in the Role (Optional, stricter approach)
    const adminUsersWithRole = usersWithRole.filter((user) => user.isAdmin);
    if (adminUsersWithRole.length > 0) {
      return res.status(400).json({ message: 'Cannot delete role with assigned admin users. Reassign admin users first.' });
    }

    // 5. Delete the Role
    await Role.deleteOne({ _id: roleId });

    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting role' });
  }