import express from "express";
const router = express.Router();
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";
import {
  createNotificationSettings,
  deleteNotificationSettings,
  getAllNotificationSettings,
  getOneByUserNotificationSettings,
  getOneNotificationSettings,
  updateNotificationSettings,
} from "../controllers/notificationsettingscontroller.js";

router.route("/").post(authenticate, createNotificationSettings);
router.route("/").get(authenticate, getAllNotificationSettings);
router.route("/user").get(authenticate, getOneByUserNotificationSettings);
router.route("/:id").get(authenticate, getOneNotificationSettings);
router.route("/:id").put(authenticate, updateNotificationSettings);
router.route("/:id").delete(authenticate, deleteNotificationSettings);

export default router;
