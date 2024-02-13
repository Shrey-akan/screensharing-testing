import { Router } from "express";
import { login, logout, myProfile, register, saveBrodCast } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.post("/register", register)
router.post("/login", login)
router.get("/me", isAuthenticated ,myProfile)
router.post("/logout", isAuthenticated ,logout)
router.post("/new", isAuthenticated ,saveBrodCast)

export default router;
