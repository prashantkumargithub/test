import { Router } from "express";
import { ProfileSetUp, User_info , AddProfileImage, User_data, HelpForm, LoginAlert, ChangePassword,SendOtpEMailChange,UpdateEmail, RemoveProfileImage, AddProfileColor} from "../controllers/User.js";
import {logedUserdata} from "../middleware/AuthMiddleware.js";
import {uploadProfileImg} from "../middleware/multer.js";

const userRoutes = Router();

userRoutes.get("/User",logedUserdata,User_info);
userRoutes.post("/ProfileSetup",logedUserdata,ProfileSetUp);
userRoutes.post('/AddProfileImage', logedUserdata, uploadProfileImg.single('Image'), AddProfileImage);
userRoutes.post('/AddProfileColor', logedUserdata, AddProfileColor);
userRoutes.post('/RemoveProfileImage', logedUserdata, RemoveProfileImage);
userRoutes.post('/UserData', logedUserdata,User_data);
userRoutes.post('/HelpForm', logedUserdata,HelpForm);
userRoutes.post('/LoginAlert', logedUserdata,LoginAlert);
userRoutes.post('/ChangePassword', logedUserdata,ChangePassword);
userRoutes.post('/sendOtpEmailchange', logedUserdata,SendOtpEMailChange);UpdateEmail
userRoutes.post('/UpdateEmail', logedUserdata,UpdateEmail);

export default userRoutes;
