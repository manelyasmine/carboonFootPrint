import express from "express";
const router = express.Router();
import { createTarget,updateTarget,detailsTarget,deleteTarget, getTarget } from "../controllers/targetcontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizedAsAdmin, createTarget);
router.route("/").get(authenticate, authorizedAsAdmin, getTarget);
router.route("/").put(authenticate,authorizedAsAdmin,updateTarget);
router.route("/details/:id").get(authenticate,authorizedAsAdmin,detailsTarget);
router.route("/:id").delete(authenticate, authorizedAsAdmin, deleteTarget);


export default router;
