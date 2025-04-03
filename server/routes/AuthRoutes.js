import { Router } from "express";
import { login, signup,googleAuth, sendOTP, VerifyOTP,ForgetPasswordOTP,ResetPassword,ResetPasswordLink} from "../controllers/AuthControllers.js";
import { rateLimit } from 'express-rate-limit';
import {logedUserdata} from "../middleware/AuthMiddleware.js";

const authRoutes = Router();

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max:10, // Limit each IP to 2 requests per windowMs
    message: "Too many attempts. Please try again in 5 minutes."
});

//PUBLIC endpoints
authRoutes.post("/signup", limiter, signup);
authRoutes.post("/login", limiter, login);
authRoutes.post("/googleAuth", limiter, googleAuth);
authRoutes.post("/sendOTP", limiter, sendOTP);
authRoutes.post("/VerifyOTP", limiter, VerifyOTP);
authRoutes.post("/ForgetPasswordOTP", limiter, ForgetPasswordOTP);
authRoutes.post("/ResetPassword", limiter, ResetPassword);
authRoutes.post("/ResetPasswordLink", limiter, ResetPasswordLink);

export default authRoutes;
