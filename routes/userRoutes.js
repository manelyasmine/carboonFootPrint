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
  updateUserStatus,uploadImage
} from "../controllers/usercontroller.js"; // Import from usercontroller.js
import {
  authenticate,
  authorizedAsAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();
router
  .route("/")
  .post(createUser)
  .put(updateUser)
  .get(authenticate,  getalluser);
router.post("/auth", loginUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(authenticate, getprofile)
  /* .put(authenticate, updateUser); */

router
  .route('/:id')
  
  .patch(updateUserStatus);

router
  .route("/:id")
  .delete(authenticate,  deleteUser)
  .get(authenticate,  getuserById)
  .put(authenticate,  updateUserById);

router.route("/profile/cover/").post(uploadImage);


export default router;
