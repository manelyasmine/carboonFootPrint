import task from "../models/tasksModel.js";
import user from "../models/userModel.js";
import target from "../models/targetModel.js";
import mongoose from "mongoose";   
import { check, validationResult } from 'express-validator';


const createTask = async (req, res) => {
  try {
    // Validation
    await check('taskName', 'Task name is required').notEmpty().run(req);
    await check('targetName', 'Target is required').notEmpty().run(req);
    await check('dueDate', 'Due Date is required').notEmpty().run(req);
    await check('userIds', 'User IDs are required').notEmpty().run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 


    const { taskName, targetName, dueDate, userIds } = req.body;
    const existingTask = await task.findOne({ taskName });
    if (existingTask) {
      return res.status(400).json({ error: "Task with this name already exists" });
    }
     // Validate that all userIds are valid users
     const validUsers = await user.find({ _id: { $in: userIds } });
     if (validUsers.length !== userIds.length) {
       return res.status(400).json({ error: "One or more user IDs are invalid" });
     }

    const createdBy = req.params.userId; // the userId of the creator is in req.params
    const mytask = new task({
      taskName,
      targetName,
      dueDate,
      assignedUser: userIds,
      createdBy
    }); 
    await mytask.save();
    res.status(201).json(mytask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
//facing some problem here
const assignTask = async (req, res) => {
  try {
    // Validation
    await check('taskId', 'Task ID is required').notEmpty().run(req);
    await check('userIds', 'User IDs are required').isArray().withMessage('User IDs must be an array').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 
    const {userIds} = req.body;
    const taskId = req.params.taskId;
    
    // Find the existing task by ID
    const existingTask = await task.findById(taskId);
    console.log("task ===>",task);
    if (!existingTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Validate if all userIds exist in the database if provided
    if (userIds) {
      const validUsers = await user.find({ _id: { $in: userIds } });

      if (validUsers.length !== userIds.length) {
        return res.status(400).json({ error: "One or more user IDs are invalid" });
      }
    }

    
    if (userIds) existingTask.assignedUser = userIds;
    await existingTask.save();

    return res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.error('Error assigning task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

const taskCompleted = async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const mytask = await task.findById(taskId);
    if (!mytask) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = "completed";
    await task.save();

    return res
      .status(200)
      .json({ message: "Task marked as completed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//add the user who updated it and when for later
const updateTask=async(req,res)=>{
  try {
    // Validation
    await check('taskName').optional().notEmpty().withMessage('Task name must not be empty').run(req);
    await check('targetName').optional().notEmpty().withMessage('Target must not be empty').run(req);
    await check('dueDate').optional().notEmpty().withMessage('Due Date must not be empty').run(req);
    await check('userIds').optional().isArray().withMessage('User IDs must be an array').run(req);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } 

    const { taskName, targetName, dueDate, userIds,id } = req.body;
    //const taskId = req.params.taskId;

    // Find the existing task by ID
    const existingTask = await task.findById(id);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Check if taskName is being updated to an already existing taskName
    if (taskName && existingTask.taskName !== taskName) {
      const taskNameExists = await task.findOne({ taskName });
      if (taskNameExists) {
        return res.status(400).json({ error: "Task with this name already exists" });
      }
    }

    // Validate if all userIds exist in the database if provided
    if (userIds) {
      const validUsers = await user.find({ _id: { $in: userIds } });
      if (validUsers.length !== userIds.length) {
        return res.status(400).json({ error: "One or more user IDs are invalid" });
      }
    }

    // Update the task fields only if they are provided
    if (taskName) existingTask.taskName = taskName;
    if (targetName) existingTask.targetName = targetName;
    if (dueDate) existingTask.dueDate = dueDate;
    if (userIds) existingTask.assignedUser = userIds;
    existingTask.updatedBy = req.user._id; // Assuming the userId of the updater is stored in req.user

    await existingTask.save();
    res.status(200).json(existingTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

 
const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;

    // Check if the task exists
    const existingTask = await task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    // Delete the task
    await task.findByIdAndDelete(taskId);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllTasks=async(req,res,next)=>{
  console.log("get all tasks")
  try {
    // Retrieve all tasks from the database
   // const tasks = await task.find({});
     
  /*  const tasks = await task.find().populate({
    path: "targetName", // Assuming the field in Role that references users
    model: target, // User model to populate
    select: "name", // Exclude password field from user data
  }); */
  const tasks = await task.find({})
  .populate({ path: "targetName", select: "name" })   // Select only the name field from target
  .populate({ path: "assignedUser", select: "username email" }); // Select only the email field from assignedUser
   

   
  const flatList = tasks.map(task => {
    const { _id, taskName,  assignedUser, status, dueDate, createdBy, createdAt, updatedAt } = task;
    const targetName = task.targetName ? task.targetName.name : null;
    const usersIds = assignedUser ;
    return { _id, taskName, targetName  , usersIds, status, dueDate, createdBy, createdAt, updatedAt };
  });

  res.json(flatList);
 
    next();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


const getMyTasks=async(req,res,next)=>{
  try {
    const userId = req.params.userId; // Assume the user ID is passed in the request parameters
    const validUser = await user.find({ _id: userId });
    
    if(validUser) {

    // Find tasks where the user is assigned
    const tasks = await task.find({ assignedUser: userId });

    res.status(200).json(tasks);
    }



  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
 

export { createTask, assignTask, taskCompleted,updateTask,deleteTask,getAllTasks, getMyTasks };
