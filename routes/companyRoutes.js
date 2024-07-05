import express from "express";
const router = express.Router();
import { createCompany,addLocation ,
  editLocation , deleteLocation, getLocations,
  getCompany,uploadImage, getImage} from "../controllers/companycontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizedAsAdmin, createCompany);


router.route("/").get(authenticate, authorizedAsAdmin, getCompany);

router.route("/location/:id").put(authenticate,authorizedAsAdmin,addLocation);

router.route("/location/:id").get(authenticate,authorizedAsAdmin,getLocations);

router.route("/:companyId/location/:locationId").put(authenticate,authorizedAsAdmin,editLocation);

router.route("/:companyId/location/:locationId").delete(authenticate,authorizedAsAdmin,deleteLocation);
router.route("/:id/image").post(authenticate,authorizedAsAdmin,uploadImage);
router.route("/:id/image").get(authenticate,authorizedAsAdmin,getImage);
export default router;
