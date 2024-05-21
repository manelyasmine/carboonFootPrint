import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  getalluser,
  getprofile,
  updateUser,
  deleteUser,
  getuserById,
  updateUserById,
} from "../controllers/usercontroller.js"; // Import from usercontroller.js
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizedAsAdmin, getalluser);
router.post("/auth", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(authenticate, getprofile)
  .put(authenticate, updateUser);

router
  .route('/:id')
  .put( authenticate,updateUser);

router
  .route("/:id")
  .delete(authenticate, authorizedAsAdmin, deleteUser)
  .get(authenticate, authorizedAsAdmin, getuserById)
  .put(authenticate, authorizedAsAdmin, updateUserById);

export default router;
