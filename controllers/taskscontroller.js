import task from "../models/tasksModel.js";

const createTask = async (req, res) => {
  try {
    const { taskName, targetName, userId } = req.body;
    if (!taskName) {
      res.json({ error: "name is required" });
    }
    const existingT = await task.findOne({ taskName });
    if (existingT) {
      return res.json({ error: "already exist" });
    }

    const mytask = await new task({
      taskName,
      targetName,
      assignedUser: userId,
    }).save();

    res.json(mytask);
  } catch (error) {
    console.log('error creation',error);
    return res.status(400).json(error);
  }
};

const assignTask = async (req, res) => {
  try {
    const { taskId, userId } = req.body;
    const task = await task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    task.assignedUser = userId;
    await task.save();

    return res.status(200).json({ message: "Task assigned successfully" });
  } catch (error) {
    console.log(error);
    return res.status(400).json(error);
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

export { createTask, assignTask, taskCompleted };
