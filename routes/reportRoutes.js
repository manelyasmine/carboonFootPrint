import express from "express";
const router = express.Router();
import { createReport , uploadImage,getReports,deleteReport} from "../controllers/reportcontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, createReport);
router.route("/").get(authenticate,authorizedAsAdmin,getReports);
router.route("/:id/image").post(authenticate,authorizedAsAdmin,uploadImage);
router.route("/:id").delete(authenticate, authorizedAsAdmin, deleteReport); 
export default router;
