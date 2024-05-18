import express from "express";
const router = express.Router();
import {
  createTask,
  assignTask,
  taskCompleted,
} from "../controllers/taskscontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizedAsAdmin, createTask);
router.route("/:id").post(authenticate, authorizedAsAdmin, taskCompleted);
router.route("/assign").post(authenticate, authorizedAsAdmin, assignTask);

export default router;
