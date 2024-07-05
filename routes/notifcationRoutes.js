import express from "express";
const router = express.Router();
import { createNotification, getAllNotificaitons, getNotification, updateBulkNotifications, updateNotification } from "../controllers/notificationcontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post( createNotification);
router.route("/").get(authenticate, getAllNotificaitons);
router.route("/:id").get(authenticate, getNotification);
router.route("/:id").put(authenticate,updateNotification);
router.route("/bulk/update").put(authenticate,updateBulkNotifications);


export default router;
