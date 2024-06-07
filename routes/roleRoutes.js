import express from "express";

const router = express.Router();

// Import your role controller functions
import {
  createRole,
  getRoles,
  updateRole,
  deleteRole, 
  detailsRole
} from "../controllers/rolecontroller.js"; // Assuming your controller name

// Import authentication and authorization middleware (if needed)
import { authenticate, authorizedAsAdmin } from "../middlewares/authMiddleware.js"; // Adapt names if different

// Define routes for roles with appropriate middleware (adapt roles as needed)

router.route("/").post(authenticate, authorizedAsAdmin, createRole);
router.route("/").get(authenticate,authorizedAsAdmin,getRoles);
router.route("/").put(authenticate,authorizedAsAdmin,updateRole);
router.route("/details/:id").get(authenticate,authorizedAsAdmin,detailsRole); //just in case we need it because isnt implemented in design
router.route("/:id").delete(authenticate, authorizedAsAdmin, deleteRole); 

 
export default router;
