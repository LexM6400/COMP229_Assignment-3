
import { Router } from "express";
import {
  createUser,
  deleteUser,
  deleteUsers,
  getUser,
  getUsers,
  updateUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, authorize("admin"));

router
  .route("/")
  .get(getUsers)
  .post(createUser)
  .delete(deleteUsers);

router
  .route("/:id")
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

export default router;
