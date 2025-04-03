import User from "../models/UserModels.js";
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';


export const logedUserdata = async (request, response, next) => {
    //getting token
    const token = request.header('Authorization');
    if (!token) {
        return response.status(404).send("Please Login OR Singup")
    }
    const JWTtoken = token.replace('Bearer', "").trim();

    try {
        // verfing token 
        const isVerified = await jwt.verify(JWTtoken, process.env.JWT_KEY);
        if (!isVerified) {
            return response.status(401).send("Session expired.")
        }
        const Userid = new mongoose.Types.ObjectId(isVerified.userID);
        const UserData = await User.findOne({ _id: Userid }).select({
            password: 0,
            OTP: 0,
        });
        request.user = UserData;
        request.id=isVerified.userID;

        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return response.status(400).send("Invalid token.");
        } else if (error instanceof jwt.TokenExpiredError) {
            return response.status(401).send("Token has expired.");
        } else {
            return response.status(500).send("Internal server error.");
        }
    }
}