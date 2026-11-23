
import { Router } from "express";
import {
  createQualification,
  deleteQualification,
  deleteQualifications,
  getQualification,
  getQualifications,
  updateQualification,
} from "../controllers/qualificationController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .get(getQualifications)
  .post(protect, authorize("admin"), createQualification)
  .delete(protect, authorize("admin"), deleteQualifications);

router
  .route("/:id")
  .get(getQualification)
  .put(protect, authorize("admin"), updateQualification)
  .delete(protect, authorize("admin"), deleteQualification);

export default router;
