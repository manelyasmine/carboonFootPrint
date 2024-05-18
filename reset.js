import express from "express";
import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

const router = express.Router();

// Forgot Password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    // Check if the email exists in the database
    const foundUser = await user.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }
    // Generate a unique token
    const token = jwt.sign({ _id: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Save the token in the database for the user
    foundUser.resetPasswordToken = token;
    foundUser.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await foundUser.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const resetLink = `http://localhost:3000/reset-password/${token}`;
    const mailOptions = {
      from: "your-email@gmail.com",
      to: email,
      subject: "Password Reset",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #666;">You are receiving this email because you (or someone else) has requested to reset the password for your account.</p>
            <p style="color: #666;">Please click on the following link to reset your password:</p>
            <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
            <p style="color: #666;">If you did not request this, please ignore this email.</p>
            <p style="color: #666;">Thank you!</p>
        </div>
    `,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ error: "Failed to send email" });
      }
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Email sent" });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//  when user click into link sends a GET request to Reset Password
router.get("/reset-password/:token", async (req, res) => {
  try {
    const { token } = req.params;
    // Find user by token and check if it's still valid
    const foundUser = await user.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!foundUser) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    // render the ejs page to reset pass
    res.render("index", { token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// reset the pass
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    // Find user by token and check if it's still valid
    const foundUser = await user.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!foundUser) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }
    // Update user's password and clear reset token fields
    const hashedPassword = await bcrypt.hash(password, 10);
    foundUser.password = hashedPassword;
    foundUser.resetPasswordToken = undefined;
    foundUser.resetPasswordExpires = undefined;
    await foundUser.save();
    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
