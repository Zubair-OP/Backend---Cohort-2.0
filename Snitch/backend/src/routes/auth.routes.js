import { Router } from "express";
const router = Router();
import { register,googleCallBack,Login,getme, logout} from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js"; 
import passport from "passport";
import {authenticateUser} from  "../middleware/auth.middlleware.js"

router.post("/register", registerValidator, register);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", {session :false}),
googleCallBack
);
router.post("/login", loginValidator, Login);
router.get('/get-me',authenticateUser, getme);  
router.get('/logout', logout);
export default router;
