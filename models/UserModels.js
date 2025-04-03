import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    UserName: {
        type: String,
        required: false,
        unique: true,
    },
    phone: {
        type: String,
        required: [true, "Phone Number is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    firstName: {
        type: String,
        required: false,
        default:"",
    },
    lastName: {
        type: String,
        required: false,
        default:"",
    },
    bio: {
        type: String,
        required: false,
        default:"",
    },
    image: {
        type: String,
        default: "",
        required: false,
    },
    color: {
        type: Number,
        default: 0,
        required: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    OTP: {
        type: String,
        default: null,
    },
    profileSetup: {
        type: Boolean,
        default: false,
    },
    isOnline: {
        type: Boolean,
        default: false,
    },
    showStatus: {
        type: Boolean,
        default: true,
    },
    loginAlert: {
        type: Boolean,
        default: true,
    },
    blockedUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [] 
        }
    ],
    blockedByUsers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: [] 
        }
    ],
})


const User = mongoose.model("Users", userSchema);

export default User;