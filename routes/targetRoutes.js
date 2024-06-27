import express from "express";
const router = express.Router();
import { createTarget,updateTarget,detailsTarget,deleteTarget, getTarget } from "../controllers/targetcontroller.js";
import {
  authenticate,
  authorizedAsAdmin,checkPermissions
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, checkPermissions(['read_targets','write_targets', 'create_targets','read_task','write_task','create_task']), createTarget);
router.route("/").get(authenticate, checkPermissions(['read_targets','write_targets', 'create_targets','read_task','write_task','create_task']), getTarget);
router.route("/").put(authenticate,checkPermissions(['read_targets','write_targets', 'create_targets','read_task','write_task','create_task']),updateTarget);
router.route("/details/:id").get(authenticate,checkPermissions(['write_targets','write_task', 'create_targets','read_task','write_task','create_task']),detailsTarget);
router.route("/:id").delete(authenticate, checkPermissions(['write_targets','write_task', 'create_targets','read_task','write_task','create_task']), deleteTarget);


export default router;
