import User from "../models/UserModels.js";
import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import HelpMessage from "../models/HelpMessage.js";
import nodemailer from "nodemailer";
import { genSalt, hash } from "bcrypt";
import { compare } from "bcrypt"
import crypto from "crypto";
import fs from 'fs';
dotenv.config();

//Configure 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    },
});

// TO get user data /User
export const User_info = async (req, res) => {
    try {
        const UserData = req.user;
        return res.status(200).json({
            UserData,
        });
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};
//Profile setup 
export const ProfileSetUp = async (req, res) => {
    try {
        const UserData = req.user.email;
        const { FName, LName, Username, bio } = req.body;

        if (!FName || !LName || !Username || !bio) {
            return res.status(400).send("All fields are required");
        }

        const user = await User.findOne({ email: UserData });
        if (!user) {
            return res.status(404).send("User does not exist.");
        }
        if (user.UserName != Username) {
            const usernameExists = await User.findOne({ UserName: Username });
            if (usernameExists) {
                return res.status(401).send("Username is not available");
            }
        }

        const updatedUser = await User.findOneAndUpdate(
            { email: UserData },
            {
                $set: {
                    firstName: FName,
                    lastName: LName,
                    bio: bio,
                    UserName: Username,
                    profileSetup: true,
                },
            },
            { new: true }
        ).select({ password: 0, OTP: 0, });

        return res.status(200).json({
            user: updatedUser,
            message: "Profile Updated successfully"
        });
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};
//User image uploading
export const AddProfileImage = async (req, res) => {
    try {
        let filePath = "";
        if (req.file) {
            filePath = req.file.filename;
        }
        const UserData = req.user.email;
        const { selectedColor } = req.body;

        const updatedUser = await User.findOneAndUpdate(
            { email: UserData },
            {
                $set: {
                    image: filePath,
                    color: selectedColor,
                },
            },
            { new: true }
        ).select({ password: 0, OTP: 0 });

        return res.status(200).json({
            user: updatedUser,
            message: "Profile Image Updated successfully",
        });
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};
export const AddProfileColor = async (req, res) => {
    try {
        const UserData = req.user.email;
        const { selectedColor } = req.body;
        const updatedUser = await User.findOneAndUpdate(
            { email: UserData },
            {
                $set: {
                    color: selectedColor,
                },
            },
            { new: true }
        ).select({ password: 0, OTP: 0 });

        return res.status(200).json({
            user: updatedUser,
            message: "Profile color updated successfully.",
        });
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};

export const RemoveProfileImage = async (req, res) => {
  try {
    const UserData = req.user.email;
    const user = await User.findOne({ email: UserData });

    if (!user) {
      return res.status(404).send("User does not exist.");
    }

    // Only attempt to delete the file if a profile image exists
    if (user.image) {
      const filePath = path.join(__dirname, '../Uploads/profileImage/', user.image);

      // Asynchronously delete the image file
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return res.status(500).send("Failed to delete the profile image.");
        }
      });
    }

    // Update the user document to remove the image
    const updatedUser = await User.findOneAndUpdate(
      { email: UserData },
      {
        $set: {
          image: "", 
        },
      },
      { new: true }
    ).select({ password: 0, OTP: 0 });

    return res.status(200).json({
      user: updatedUser,
      message: "Profile image removed successfully.",
    });

  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).send("Internal server error");
  }
};

//Image
export const ImageAccess = (req, res) => {
    const { folder, filename } = req.params;
    const filePath = path.join(__dirname, '../Uploads', folder, filename); // Adjust path to reach the 'Uploads' folder

    res.sendFile(filePath, (err) => {
        if (err) {
            res.status(err.status || 500).send('File not found');
        }
    });
};

//User data form id
export const User_data = async (req, res) => {
    try {
        const UserId = req.body.id;
        const UserData = await User.findOne({ _id: UserId }).select({ password: 0, OTP: 0, });
        return res.status(200).json({
            UserData,
        });
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};

export const HelpForm = async (req, res) => {
    try {
        const { email, firstName: fname, lastName: lname } = req.user;
        const { message: Message } = req.body;

        // Save help message to the database
        const newHelpMessage = await HelpMessage.create({
            email: email,
            message: Message,
            fname: fname,
            lname: lname
        });

        if (newHelpMessage) {
            // Prepare mail options to notify admin
            const mailOptions = {
                from: `"ConnectyPi" <${process.env.EMAIL}>`,
                to: "prashantexperiment1@gmail.com",
                subject: "Help & Support || Query",
                text: `Name: ${newHelpMessage.fname} ${newHelpMessage.lname}\nEmail: ${newHelpMessage.email}\nMessage: ${newHelpMessage.message}`
            };

            // Send the email to the admin
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(501).send(`Internal server error`);
                }
                res.status(200).send('Form submitted successfully.');
            });
        }

    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};

export const LoginAlert = async (req, res) => {
    const userId = req.user.id;
    const { loginAlert } = req.body;
    try {
        const UserData = await User.findOneAndUpdate(
            { _id: userId },
            { $set: { loginAlert: loginAlert } },
            { new: true }
        );
        return res.status(200).send(`Login Alert updated successfully`)
    } catch (error) {
        return res.status(500).send(`Internal server error`);
    }
};

export const ChangePassword = async (req, res) => {
    try {
        const userId = req.id;
        // Getting credentials and password from the request body
        const { CPassword, NPassword, CCPassword } = req.body;

        // Checking if all required fields are provided
        if (!CPassword || !NPassword || !CCPassword) {
            return res.status(400).send("All fields are required");
        }

        // Checking if the new password and confirm password match
        if (NPassword !== CCPassword) {
            return res.status(400).send("New password and confirm password do not match. Try again.");
        }

        // Finding the user in the database using the userId
        const user = await User.findById({_id:userId});
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Checking if the provided current password matches the stored one
        const auth = await compare(CPassword, user.password);
        if (!auth) {
            return res.status(400).send("Incorrect current password.");
        }

        // Hashing the new password
        const salt = await genSalt(10);
        const hashPassword = await hash(NPassword, salt);

        // Updating the user's password
        await User.findByIdAndUpdate({_id:userId}, { password: hashPassword });

        return res.status(200).send("Password updated successfully");
    } catch (error) {
        console.error('Error changing password:', error);
        return res.status(500).send("Internal server error");
    }
};

export const SendOtpEMailChange = async (req, res) => {
    const { email } = req.body;
    const userId = req.id;

    try {
      //create otp
      const OTP = crypto.randomInt(100000, 999999);
      const user = await User.findOne({ email });
  
      if (user) {
        return res.status(404).send('User already exist with this email.');
      }
        const Update_user = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { OTP: OTP } },
          { new: true }
        );
  
      // Send OTP via email
      const mailOptions = {
        from: `"ConnectyPi" <${process.env.EMAIL}>`,
        to: email,
        subject: "Email verification",
        text: `Hi there, Your Email verification code to add new email is ${OTP}`
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          
          return res.status(500).send(`Internal server error ${error}`);
        }
        res.status(200).send('OTP sent successfully');
      });
    } catch (error) {
    
        return res.status(500).send(`Internal server error ${error}`);
      }
};

export const UpdateEmail = async (req, res) => {
    const { email, OTP } = req.body;
    const userId = req.id;
    try {
      const user = await User.findOne({ _id:userId }).select({ password: 0, });
      if (user.OTP == OTP) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: userId },
          { $set: { email: email, OTP: null } },
          { new: true }
        ).select({ password: 0, OTP: 0, });
        return res.status(200).json({
          message: 'Email Updated successfully',
          user: updatedUser,
        });
      }
      else {
        return res.status(400).send('Invalid OTP');
      }
  
  
    } catch (error) {
        consle.log(error)
      return res.status(500).send(`Internal server error ${error}`);
    }
};