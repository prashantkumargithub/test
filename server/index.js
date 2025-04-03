// Importing required modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { ImageAccess } from "./controllers/User.js";
import userRoutes from "./routes/UserRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import SetUpSocket from "./soket.js";
import messageRoutes from "./routes/MessageRoutes.js";

// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
mongoose.connect(databaseURL)
    .then(() => console.log("Database connected successfully"))
    .catch(err => console.log("Database Connection Error:", err.message));

// Configure CORS
app.use(cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));

app.options('*', cors());

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// API Endpoints
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/User", userRoutes);
app.use("/api/v1/Contacts", contactsRoutes);
app.use("/api/v1/message", messageRoutes);

// Static file serving for image uploads
app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));
app.get('/image/:folder/:filename', ImageAccess);
app.get('/file/:folder/:filename', ImageAccess);

// Deployment Configuration
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, "Client", "dist")));

    app.get('*', (req, res) => {  
        res.sendFile(path.join(__dirname, "Client", "dist", "index.html"));
    });
    console.log("Serving frontend from:", path.join(__dirname, "Client", "dist", "index.html"));
}


// Start the server
const server = app.listen(port, () => {
    console.log(`Server is started at http://localhost:${port}`);
});

// Initialize WebSockets
SetUpSocket(server);
