import User from "../models/UserModels.js";
import jwt from "jsonwebtoken";
import { compare } from "bcrypt"
import crypto from "crypto";
import nodemailer from "nodemailer";
import { genSalt, hash } from "bcrypt";
import dotenv from "dotenv";
import useragent from "useragent";
dotenv.config();
import axios from "axios";

//Creating token
const createToken = (userId) => {
  return jwt.sign({ userID: userId }, process.env.JWT_KEY, { expiresIn: "100d" });
};

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

//=============================================SIGNUP==========================================================

//Creating Signup
export const signup = async (request, response, next) => {
  try {
    // Getting email, phone, and password 
    const { email, phone, password, ConfirmPassword } = request.body;

    // Checking email, phone, and password
    if (!email || !phone || !password || !ConfirmPassword) {
      return response.status(400).send("All credentials are required");
    }
    // Check if the email and phone already exists in the database
    const existingUserByEmail = await User.findOne({ email: email });
    if (existingUserByEmail) {
      return response.status(400).send("Email is already in use");
    }
    const existingUserByPhone = await User.findOne({ phone: phone });
    if (existingUserByPhone) {
      return response.status(400).send("Phone number is already in use");
    }
    if (password !== ConfirmPassword) {
      return response.status(400).send("Please make sure your passwords match. Try again.");
    }

    // Creating user in db
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);
    const user = await User.create({ email: email, phone: phone, password: hashPassword });

    //Sending response
    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        profileSetup: user.profileSetup,
        isVerified: user.isVerified
      },
      token: createToken(user._id),
    });


  } catch (error) {
    return response.status(500).send(`Internal server error ${error}`);
  }
};

//=============================================LOGIN==========================================================
//Creating Login
export const login = async (request, response, next) => {
  try {
    // Getting credentials and password from the request body
    const { email, password } = request.body;

    // Checking if both email and password are provided
    if (!email || !password) {
      return response.status(400).send("All credentials are required");
    }

    // Finding the user in the database using email, username, or phone
    const user = await User.findOne({
      $or: [{ email: email }, { UserName: email }, { phone: email }]
    });

    // If the user doesn't exist
    if (!user) {
      return response.status(404).send("Invalid Credentials");
    }

    // Checking if the provided password matches the stored one
    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(404).send("Invalid Credentials");
    }

    // Getting device and location information
    const userAgentString = request.headers["user-agent"];
    const agent = useragent.parse(userAgentString);
    const deviceInfo = {
      device: agent.device.toString(), // Device info
      os: agent.os.toString(),         // Operating system
      browser: agent.toAgent(),        // Browser info
    };
    // If the user has login alerts enabled, send an alert email
    if (user.loginAlert) {
      const mailOptions = {
        from: `"ConnectyPi" <${process.env.EMAIL}>`,
        to: user.email,
        subject: "New Login Detected",
        text: `We noticed a new login for ${user.UserName ? user.UserName : user.firstName}.\n\nDevice: ${deviceInfo.device}\nOS: ${deviceInfo.os}\nBrowser: ${deviceInfo.browser}`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return response.status(500).send(`Internal server error: ${error}`);
        }
      });
    }

    // Exclude the password before returning user data
    const { password: _password, OTP: _OTP, ...userData } = user.toObject();

    // Returning user data and the JWT token after successful login
    return response.status(200).json({
      user: {
        ...userData, // Spread user data excluding password and OTP
      },
      token: createToken(user._id),
    });

  } catch (error) {
    return response.status(500).send(`Internal server error:${error}`);
  }
};



//Google login
export const googleAuth = async (request, response, next) => {
  try {
    const email = request.body;
    const user = await User.findOne({ email: email.user });
    if (!user) {
      return response.status(404).send("Invalid Credentials");
    }


    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        profileSetup: user.profileSetup,
        isVerified: user.isVerified
      },
      token: createToken(user._id),
    });

  } catch (error) {
    return response.status(500).send(`Internal server error ${error}`);
  }
}

//======================================Email verification=============================================
//sending otp via email
export const sendOTP = async (request, res, next) => {
  const { email } = request.body;
  try {
    //create otp
    const OTP = crypto.randomInt(100000, 999999);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not exist with this email.');
    }
    if (!user.isVerified) {
      const Update_user = await User.findOneAndUpdate(
        { email: email },
        { $set: { OTP: OTP } },
        { new: true }
      );
    }

    else {
      return res.status(409).send('Email is already Veirired');
    }

    // Send OTP via email
    const mailOptions = {
      from: `"ConnectyPi" <${process.env.EMAIL}>`,
      to: email,
      subject: "Email verification",
      text: `Hi there, Your Email verification code is ${OTP}`
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

}

//verifiy email otp
export const VerifyOTP = async (req, res, next) => {
  const { email, OTP } = req.body;
  try {
    const user = await User.findOne({ email }).select({ password: 0, });
    if (!user) {
      return res.status(404).send('User not exist with this email.');
    }
    if (user.OTP == OTP) {
      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true, OTP: null } },
        { new: true }
      ).select({ password: 0, OTP: 0, });
      const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: "15m" });
      return res.status(200).json({
        message: 'Email verified successfully',
        user: updatedUser,
        token: token,
      });
    }
    else {
      return res.status(400).send('Invalid OTP');
    }


  } catch (error) {
    return response.status(500).send(`Internal server error ${error}`);
  }
}
//==========================FORGET PASSWORD=======================================
export const ForgetPasswordOTP = async (request, res, next) => {
  const { email } = request.body;
  try {
    //create otp
    const OTP = crypto.randomInt(100000, 999999);
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send('User not exist with this email.');
    }
    const Update_user = await User.findOneAndUpdate(
      { email: email },
      { $set: { OTP: OTP } },
      { new: true }
    );

    // Send OTP via email
    const mailOptions = {
      from: `"ConnectyPi" <${process.env.EMAIL}>`,
      to: email,
      subject: "Forget Password",
      text: `Hi there, Your Email verification code for Reseting your password  is ${OTP}`
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

}

export const ResetPasswordLink = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email }).select({ password: 0, });
    if (!user) {
      return res.status(404).send('User not exist with this email.');
    }
    const token = jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, { expiresIn: "15m" });
    const resetLink = `${process.env.ORIGIN}/Newpassword/${user._id}/${token}`;
    // Send Link via email
    const mailOptions = {
      from: `"ConnectyPi" <${process.env.EMAIL}>`,
      to: email,
      subject: 'Password Reset',
      html: `Hi there!<br><br>
        Your password reset link is provided below. Simply click on the button to reset your password.<br><br>
        <a href="${resetLink}">Reset Password</a><br><br>
        If the button doesn't work or you encounter any issues, please copy and paste the following link into your browser to access the reset page:<br>
        <a href="${resetLink}">${resetLink}</a><br><br>
        If you did not request a password reset, please ignore this email. If you have any questions or need further assistance, feel free to contact our support team.<br><br>
        Thank you!`
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        
        return res.status(500).send(`Internal server error ${error}`);
      }
      res.status(200).send('Link sent successfully');
    });
  } catch (error) {
    
    return res.status(500).send(`Internal server error ${error}`);
  }
}

export const ResetPassword = async (req, res, next) => {
  const { userId, token, Password, CPassword } = req.body;

  try {
    // Check if userId and token are provided
    if (!userId || !token) {
      return res.status(400).send('Unauthorized access');
    }

    // Check if both password fields are provided
    if (!Password || !CPassword) {
      return res.status(400).send('All fields are required.');
    }

    // Check if the passwords match
    if (Password !== CPassword) {
      return res.status(400).send('Passwords do not match.');
    }

    // Verify the token
    const decode = jwt.verify(token, process.env.JWT_KEY);

    // Check if the token is valid
    if (!decode) {
      return res.status(401).send('Unauthorized access');
    }

    // Check if the decoded userId matches the provided userId
    if (decode.id !== userId) {
      return res.status(400).send('Unauthorized access');
    }

    // Generate a salt and hash the new password
    const salt = await genSalt(10);
    const hashPassword = await hash(Password, salt);

    // Find the user by email and update the password
    const user = await User.findOneAndUpdate(
      { email: decode.email },
      { $set: { password: hashPassword } },
      { new: true }
    );

    // Check if user was found and updated
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Send success response
    return res.status(200).send('Password updated successfully');
  } catch (error) {
    // Handle different types of errors
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).send('Unauthorized access');
    } else if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).send('Session expired.');
    } else {
      return res.status(500).send('Internal server error.');
    }
  }
}
