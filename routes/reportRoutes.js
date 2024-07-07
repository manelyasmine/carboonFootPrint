import express from "express";
const router = express.Router();
import { createReport , uploadImage,getReports,deleteReport} from "../controllers/reportcontroller.js";
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

import multer from "multer";
import path from "path";
// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/reports');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });
router.route("/").post(authenticate, upload.single('file'), createReport);
router.route("/").get(authenticate,authorizedAsAdmin,getReports);
router.route("/:id/image").post(authenticate,authorizedAsAdmin,uploadImage);
router.route("/:id").delete(authenticate, authorizedAsAdmin, deleteReport); 
export default router;
