import { Router } from "express";
const router = Router();
import { register,googleCallBack,Login,getme, logout} from "../controllers/auth.controller.js";
import { loginValidator, registerValidator } from "../validator/auth.validator.js"; 
import passport from "passport";
import {authenticateUser} from  "../middleware/auth.middlleware.js"

const getGoogleCallbackURL = (req) => {
	const forwardedProto = req.headers['x-forwarded-proto']?.split(',')[0]?.trim();
	const protocol = forwardedProto || req.protocol;
	const host = req.get('x-forwarded-host') || req.get('host');

	return `${protocol}://${host}/api/auth/google/callback`;
};

router.post("/register", registerValidator, register);
router.get(
	"/google",
	(req, res, next) => {
		passport.authenticate("google", {
			callbackURL: getGoogleCallbackURL(req),
			scope: ["profile", "email"],
			prompt: "consent",
			accessType: "offline",
			includeGrantedScopes: true,
		})(req, res, next);
	}
);
router.get("/google/callback", passport.authenticate("google", {session :false}),
googleCallBack
);
router.post("/login", loginValidator, Login);
router.get('/get-me',authenticateUser, getme);  
router.get('/logout', logout);
export default router;
