import { Router } from "express";
import {logedUserdata} from "../middleware/AuthMiddleware.js";
import { AddMsgFile, DeleteChat, DeleteMessages, GetMessages,BlockUser,UnBlockUser, DeleteAllChat } from "../controllers/MessageController.js";
import {uploadMsgFile} from "../middleware/multer.js"
const messageRoutes = Router();


messageRoutes.post("/getMessage",logedUserdata,GetMessages);
messageRoutes.post('/UploadMsgFile', logedUserdata, uploadMsgFile.single('file'), AddMsgFile);
messageRoutes.delete("/delMessage",DeleteMessages);
messageRoutes.delete("/deleteChat",logedUserdata,DeleteChat);
messageRoutes.post("/blockUser",logedUserdata,BlockUser);
messageRoutes.post("/unblockUser",logedUserdata,UnBlockUser);DeleteAllChat
messageRoutes.delete("/deleteAllChat",logedUserdata,DeleteAllChat);

export default messageRoutes;
