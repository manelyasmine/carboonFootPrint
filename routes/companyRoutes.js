import express from "express";
const router = express.Router();
import { createCompany } from "../controllers/companycontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizedAsAdmin, createCompany);
export default router;
