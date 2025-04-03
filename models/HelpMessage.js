import mongoose from "mongoose";

const helpMessage = new mongoose.Schema({
    email:{
        type:String,
        ref:"Users",
        required:true,
    },
    fname:{
        type:String,
        required:true,
    },
    lname:{
        type:String,
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now,
    }
})

const HelpMessage = mongoose.model("HelpMessage", helpMessage);
export default HelpMessage;