
import { Router } from "express";
import {
  createContact,
  deleteContact,
  deleteContacts,
  getContact,
  getContacts,
  updateContact,
} from "../controllers/contactController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = Router();

router
  .route("/")
  .post(createContact)
  .get(protect, authorize("admin"), getContacts)
  .delete(protect, authorize("admin"), deleteContacts);

router
  .route("/:id")
  .get(protect, authorize("admin"), getContact)
  .put(protect, authorize("admin"), updateContact)
  .delete(protect, authorize("admin"), deleteContact);

export default router;
