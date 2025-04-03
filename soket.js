import { Server as SocketIoServer } from "socket.io";
import Message from "./models/MessagesModel.js";
import User from "./models/UserModels.js"

const SetUpSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin:[process.env.ORIGIN],
            methods: ["GET", "POST"],
            credentials: true,
        }
    });

    const userSocketMap = new Map();

    const disconnect = async(socket) => {
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                await User.findByIdAndUpdate({ _id: userId }, { $set: { isOnline: false } });
                userSocketMap.delete(userId);
                break;
            }
        }
    }
    //Send Message function
    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipentSocketId = userSocketMap.get(message.recipent);
        const createdMessage = await Message.create(message);
        const messageData = await Message.findById(createdMessage._id).populate("sender", "id email firstName lastName image color").populate("recipent", "id email firstName lastName image color");

        if (recipentSocketId) {
            io.to(recipentSocketId).emit("recieveMessage", messageData)
        }
        if (senderSocketId) {
            io.to(senderSocketId).emit("recieveMessage", messageData)
        }
    }

    io.on("connection", async (socket) => {
        const userId = socket.handshake.query.UserId;

        if (userId) {
            userSocketMap.set(userId, socket.id);
        }

        await User.findByIdAndUpdate({ _id: userId }, { $set: { isOnline: true } });

        socket.on("sendMessage", (s) => { sendMessage(s) })
        socket.on("disconnect", () => { disconnect(socket) });
    });
}

export default SetUpSocket