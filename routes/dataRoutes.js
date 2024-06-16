import express from "express";
const router = express.Router();
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";
import { createData, deleteData, generateRow, getData, updateData, uploadBatch, uploadFile } from "../controllers/datacontroller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// router.post("/", upload.single("file"), uploadFile);
router.post("/batch", uploadBatch);

router.route("/").post(authenticate, createData);
router.route("/").get(authenticate, getData);
router.route("/:id").put(authenticate,updateData);
router.route("/:id").delete(authenticate, deleteData);
router.route("/generaterow").post(authenticate, generateRow);
// router.route("/details/:id").get(authenticate,authorizedAsAdmin,detailsTarget);

export default router;
