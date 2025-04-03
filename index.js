// Importing required modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Importing routes and socket setup
import authRoutes from "./routes/AuthRoutes.js";
import userRoutes from "./routes/UserRoutes.js";
import contactsRoutes from "./routes/ContactsRoutes.js";
import messageRoutes from "./routes/MessageRoutes.js";
import { ImageAccess } from "./controllers/User.js";
import SetUpSocket from "./soket.js";

// Load environment variables
dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const databaseURL = process.env.DATABASE_URL;

// Resolve directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
mongoose
    .connect(databaseURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => console.error("❌ Database Connection Error:", err.message));

// Configure CORS
app.use(
    cors({
        origin: process.env.ORIGIN || "http://localhost:3000", // Adjust based on frontend deployment
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

app.options("*", cors());

// Middleware setup
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/contacts", contactsRoutes);
app.use("/api/v1/message", messageRoutes);

// Static file serving for uploads
app.use("/Uploads", express.static(path.join(__dirname, "Uploads")));
app.get("/image/:folder/:filename", ImageAccess);
app.get("/file/:folder/:filename", ImageAccess);

// Serve frontend in production mode
if (process.env.NODE_ENV === "production") {
    const clientPath = path.join(__dirname, "Client", "dist");
    app.use(express.static(clientPath));

    app.get("*", (req, res) => {
        res.sendFile(path.join(clientPath, "index.html"));
    });
    console.log("🚀 Serving frontend from:", clientPath);
}

// Start the server
const server = app.listen(port, () => {
    console.log(`✅ Server started at http://localhost:${port}`);
});

// Initialize WebSockets
SetUpSocket(server);
