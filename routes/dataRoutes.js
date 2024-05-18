import express from "express";
const router = express.Router();
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";
import { uploadFile } from "../controllers/datacontroller.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/", upload.single("file"), uploadFile);

export default router;
