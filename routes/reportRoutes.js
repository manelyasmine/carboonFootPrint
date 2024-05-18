import express from "express";
const router = express.Router();
import { createReport } from "../controllers/reportcontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, createReport);
export default router;
