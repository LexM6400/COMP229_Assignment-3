
import { Router } from "express";
import {
  createProject,
  deleteProject,
  deleteProjects,
  getProject,
  getProjects,
  updateProject,
} from "../controllers/projectController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getProjects)
  .post(protect, authorize("admin"), createProject)
  .delete(protect, authorize("admin"), deleteProjects);

router
  .route("/:id")
  .get(getProject)
  .put(protect, authorize("admin"), updateProject)
  .delete(protect, authorize("admin"), deleteProject);

export default router;
