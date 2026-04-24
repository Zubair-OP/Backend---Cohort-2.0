import { Router } from "express";
const router = Router();
import { register,googleCallBack,Login } from "../controllers/auth.controller.js";
import { registerValidator } from "../validator/auth.validator.js"; 
import passport from "passport";

router.post("/register", registerValidator, register);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {session :false}),
googleCallBack
);
router.post("/login", Login);

export default router;
