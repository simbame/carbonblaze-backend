import { Router } from "express";

import { register, login } from "../controllers/authController"; //, login

const router = Router();

router.post("/register", register);
router.post("/login", login); // Placeholder for login

export default router;
