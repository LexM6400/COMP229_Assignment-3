import { Router } from "express";
import { getCurrentUser, signIn, signOut, signUp } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/signout", protect, signOut);
router.get("/me", protect, getCurrentUser);

export default router;
