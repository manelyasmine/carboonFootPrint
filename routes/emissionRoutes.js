import express from "express";
const router = express.Router();
import { getEmissionFactor } from "../controllers/emissioncontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").get(authenticate, getEmissionFactor);
export default router;
