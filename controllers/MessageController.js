import Message from '../models/MessagesModel.js'
import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import User from '../models/UserModels.js';

// Define __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const GetMessages = async (request, response, next) => {
    try {
        const user1 = request.id;//The id when api hitted by the the user is collected
        const user2 = request.body.id//The id passed for the forntend in api of the user is this

        if (!user1 || !user2) {
            return response.status(400).send("Both Id's are required");
        }

        const messages = await Message.find({
            $or: [
                { sender: user1, recipent: user2 }, { sender: user2, recipent: user1 }
            ]
        }).sort({ timestamp: 1 }).populate("sender", "id email firstName lastName image color").populate("recipent", "id email firstName lastName image color");;

        return response.status(200).json({ messages });
    } catch (error) {
        return response.status(500).send(`Internal server error ${error}`);
    }
};

//Upload File of message
export const AddMsgFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("File is required")
        }
        const filePath = req.file.filename;
        return res.status(200).json({
            filePath: filePath,
            fileName: req.file.originalname
        });
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};


export const DeleteMessages = async (request, response, next) => {
    try {
        const messageId = new mongoose.Types.ObjectId(request.body.MsgId);
        const MsgType = request.body.MsgType;
        const fileUrl = request.body.fileUrl;

        if (!messageId) {
            return response.status(400).send(`Message should be selected.`);
        }
        const DELMSG = await Message.deleteOne({ _id: messageId });
        if (DELMSG.deletedCount > 0) {
            if (MsgType !== "file") {
                return response.status(200).send("Message deleted successfully");
            } else {
                const filePath = path.join(__dirname, '../Uploads/MsgFiles/', fileUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error("Failed to delete the file", err);
                        return response.status(500).send("Message deleted but file removal failed.");
                    }
                    return response.status(200).send("Message and file deleted successfully");
                });
            }
        } else {
            return response.status(500).send("Failed to delete the message");
        }
    } catch (error) {
        return response.status(500).send(`Internal server error ${error}`);
    }
};

export const DeleteChat = async (request, response, next) => {
    try {
        const user1 = request.id; // The ID of the user making the API request
        const user2 = request.body.id; // The ID passed in the API request body

        if (!user1 || !user2) {
            return response.status(400).send("Both Users are required.");
        }

        // Find the messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: user1, recipent: user2 },
                { sender: user2, recipent: user1 }
            ]
        });
        // Loop through messages and delete files if MessageType is 'file'
        messages.forEach(message => {
            if (message.messageType === 'file') {
                const filePath = path.join(__dirname, '../Uploads/MsgFiles/', message.fileUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return response.status(500).send(`Failed to delete message`);
                    }
                });
            }
        });

        // After deleting files, delete the messages
        const DelChat = await Message.deleteMany({
            $or: [
                { sender: user1, recipent: user2 },
                { sender: user2, recipent: user1 }
            ]
        });
        if (DelChat.deletedCount > 0) {
            return response.status(200).send("Chat and associated files deleted successfully.");
        }
    } catch (error) {
        return response.status(500).send(`Internal server error: ${error.message}`);
    }
};

export const BlockUser = async (request, response, next) => {
    try {
        const user1 = request.id; // The ID of the user making the API request
        const user2 = request.body.id; // The ID passed in the API request body

        if (!user1 || !user2) {
            return response.status(400).send("Both Users are required.");
        }

        const BlockedUser = await User.findByIdAndUpdate(user1, {
            $addToSet: { blockedUsers: user2 }
        });
        const BlockedByUser = await User.findByIdAndUpdate(user2, {
            $addToSet: { blockedByUsers: user1 }
        });
        const messages = await Message.find({
            $or: [
                { sender: user1, recipent: user2 },
                { sender: user2, recipent: user1 }
            ]
        });
        // Loop through messages and delete files if MessageType is 'file'
        messages.forEach(message => {
            if (message.messageType === 'file') {
                const filePath = path.join(__dirname, '../Uploads/MsgFiles/', message.fileUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return response.status(500).send(`Failed to delete message`);
                    }
                });
            }
        });

        // After deleting files, delete the messages
        const DelChat = await Message.deleteMany({
            $or: [
                { sender: user1, recipent: user2 },
                { sender: user2, recipent: user1 }
            ]
        });
        return response.status(200).send(`User Blocked`);
    } catch (error) {
        return response.status(500).send(`Internal server error: ${error.message}`);
    }
};

export const UnBlockUser = async (request, response, next) => {
    try {
        const user1 = request.id; // The ID of the user making the API request
        const user2 = request.body.id; // The ID passed in the API request body

        if (!user1 || !user2) {
            return response.status(400).send("Both Users are required.");
        }

        const BlockedUser = await User.findByIdAndUpdate(user1, {
            $pull: { blockedUsers: user2 }
        });
        const BlockedByUser = await User.findByIdAndUpdate(user2, {
            $pull: { blockedByUsers: user1 }
        });
        return response.status(200).send(`User Unbloked`);
    } catch (error) {
        return response.status(500).send(`Internal server error: ${error.message}`);
    }
};


export const DeleteAllChat = async (request, response, next) => {
    try {
        const user1 = request.id; // The ID of the user making the API request

        if (!user1) {
            return response.status(400).send("Both Users are required.");
        }

        // Find the messages between the two users
        const messages = await Message.find({
            $or: [
                { sender: user1 },
                { recipent: user1 }
            ]
        });
        // Loop through messages and delete files if MessageType is 'file'
        messages.forEach(message => {
            if (message.messageType === 'file') {
                const filePath = path.join(__dirname, '../Uploads/MsgFiles/', message.fileUrl);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return response.status(500).send(`Failed to delete message`);
                    }
                });
            }
        });

        // After deleting files, delete the messages
        const DelChat = await Message.deleteMany({
            $or: [
                { sender: user1 },
                { recipent: user1 }
            ]
        });
        if (DelChat.deletedCount > 0) {
            return response.status(200).send("All chats deleted successfully.");
        }
    } catch (error) {
        return response.status(500).send(`Internal server error: ${error.message}`);
    }
};
