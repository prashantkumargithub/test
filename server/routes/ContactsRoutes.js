import { Router } from "express";
import {logedUserdata} from "../middleware/AuthMiddleware.js";
import { getUserListForDM, searchContacts } from "../controllers/ContactsController.js";

const contactsRoutes = Router();


contactsRoutes.post("/search",logedUserdata,searchContacts);
contactsRoutes.get("/getUserListForDM",logedUserdata,getUserListForDM);


export default contactsRoutes;
