import { Router } from "express";

import { register, login, dashboard } from "../controllers/authController"; //, login
import { checkToken } from "../middlewares/authmiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login); // Placeholder for login
router.get("/dashboard", checkToken, dashboard);

export default router;
