//Importing required files and Modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import {ImageAccess} from "./controllers/User.js";
import userRoutes from "./routes/UserRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import SetUpSocket from "./soket.js";
import messageRoutes from "./routes/MessageRoutes.js";


//Configuring some variable
dotenv.config();
const app = express();
const port = process.env.PORT;
const dataaseURL = process.env.DATABASE_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//connecting with Database
mongoose.connect(dataaseURL).then(()=>{console.log("Database connected successfully");}).catch((err=>console.log(err.message)))

//CORS
app.use(cors({
    origin:[process.env.ORIGIN],
    methods:["GET","POST","PUT","PATCH","DELETE"],
    credentials:true,
}))

app.options('*', cors());

//Cookie and JSON
app.use(cookieParser());
app.use(express.json())

//Api endpoints
app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/User",userRoutes)
app.use("/api/v1/Contacts",contactsRoutes)
app.use("/api/v1/message",messageRoutes)
//Image accessing route
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.get('/image/:folder/:filename', ImageAccess);
app.get('/file/:folder/:filename', ImageAccess);
// Root route to serve welcome message
// app.get("/", (req, res) => {
//     res.send(`
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//             <meta charset="UTF-8">
//             <meta name="viewport" content="width=device-width, initial-scale=1.0">
//             <title>Welcome to ConnectyPi</title>
//             <style>
//                 body {
//                     font-family: Arial, sans-serif;
//                     background-color: #f0f4f8;
//                     display: flex;
//                     justify-content: center;
//                     align-items: center;
//                     height: 100vh;
//                     margin: 0;
//                 }
//                 .welcome-container {
//                     text-align: center;
//                     background-color: #ffffff;
//                     border-radius: 10px;
//                     box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
//                     padding: 40px;
//                     max-width: 500px;
//                 }
//                 .welcome-container h1 {
//                     color: #007bff;
//                     font-size: 36px;
//                     margin-bottom: 20px;
//                 }
//                 .welcome-container p {
//                     color: #555555;
//                     font-size: 18px;
//                     margin-bottom: 20px;
//                 }
//                 .welcome-container a {
//                     display: inline-block;
//                     background-color: #007bff;
//                     color: white;
//                     padding: 10px 20px;
//                     border-radius: 5px;
//                     text-decoration: none;
//                     transition: background-color 0.3s;
//                 }
//                 .welcome-container a:hover {
//                     background-color: #0056b3;
//                 }
//             </style>
//         </head>
//         <body>
//             <div class="welcome-container">
//                 <h1>Welcome to ConnectyPi!</h1>
//                 <p>Stay Connected, Always</p>
//                 <a href="https://connectypi.in.net/">Back to ConnectyPi</a>
//             </div>
//         </body>
//         </html>
//     `);
// });


// Code for deplyoment
if(process.env.NODE_ENV ==='prodction'){
    const dirPath = path.resolve();
    app.use(express.static("./Client/dist"));
    app.get('*',(res,req)=> {
        res.sendFile(path.resolve(dirPath, './Client/dist','index.html'));
    });
}


//Starting sever
const server = app.listen(port,()=>{
    console.log(`Server is started at http://localhost:${port}`);
})
SetUpSocket(server)