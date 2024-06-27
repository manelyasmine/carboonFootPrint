import express from "express";
const router = express.Router();
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";
import { searchAll } from "../controllers/SearchController.js";
import multer from "multer";

const storage = multer.memoryStorage(); 
 
 
router.route("/").get(authenticate, searchAll); 

export default router;
