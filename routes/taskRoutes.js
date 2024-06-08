import express from "express";
const router = express.Router();
import {
  createTask,
  assignTask,
  taskCompleted,updateTask,deleteTask ,getAllTasks,getMyTasks
} from "../controllers/taskscontroller.js";
import {
  authenticate,
  authorizedAsAdmin,checkPermissions
} from "../middlewares/authMiddleware.js";

router.route("/:userId").post(authenticate, checkPermissions(['write_task', 'create_task']), createTask);
router.route("/").put(authenticate, checkPermissions(['write_task', 'create_task']), updateTask);
router.route("/:taskId").delete(authenticate, checkPermissions(['write_task', 'create_task']), deleteTask);
router.route("/assign/:taskId").put(authenticate, checkPermissions(['write_task', 'create_task']), assignTask);
router.route("/").get(authenticate, checkPermissions(['write_task', 'create_task']), getAllTasks);

//MY TASKS 

router.route("/:userId").get(authenticate, checkPermissions(['write_task', 'create_task']), getMyTasks);

router.route("/:id").post(authenticate, authorizedAsAdmin, taskCompleted);
export default router;
