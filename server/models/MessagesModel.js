import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:true,
    },
    recipent:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users",
        required:false,
    },
    messageType:{
        type:String,
        enum:["text","file"],
        required:true,
    },
    content:{
        type:String,
        required:function(){
            return this.messageType === "text";
        },
    },
    fileUrl:{
        type:String,
        required:function(){
            return this.messageType === "file";
        },
    },
    fileName:{
        type:String,
        required:function(){
            return this.messageType === "file";
        },
    },
    timestamp:{
        type:Date,
        default:Date.now,
    }
})

const Message = mongoose.model("Messages", messageSchema);
export default Message;