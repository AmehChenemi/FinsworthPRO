const express= require("express")
const userModel= require("../models/userModel")
const { gentoken } = require('../jwt');
const jwt = require("jsonwebtoken");
const { validateCreateUser, validateLogin } = require('../validation/validation');
const cloudinary = require("../middleware/cloudinary");
const { dynamicEmail } = require("../html");
const bcrypt = require("bcrypt");
const crypto = require('crypto');
 const {Email} = require("../validation/email.js");
 const nodemailer= require("nodemailer")
 require("dotenv").config()

exports.createUser = async (req, res) => {
  try {
    const { error } = validateCreateUser(req.body);
            if (error) {
       return res.status(400).json(error.message);
           } else {
    const { lastName, firstName, email, password, company_Name, role} = req.body;

    // Check for required fields
    if (!lastName || !firstName || !email || !password ||!company_Name ||!role) {
      return res.status(400).json({
        message: "Missing required fields. Make sure to include Lastname, Firstname, email, and password.",
      });
    }

    // Check if the email already exists
    const emailExist = await userModel.findOne({ email: email.toLowerCase() });
    if (emailExist) {
      return res.status(400).json({
        message: "This email already exists",
      });
    }

    // Hash the password
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);

    // Generate a JWT token
    const token = jwt.sign(
      { lastName, firstName, email,role },
      process.env.SECRET,
      { expiresIn: "120s" }
    );
    
    

    // Upload profile picture to Cloudinary
    // const profilepicture = req.files && req.files.profilepicture;
    // if (!profilepicture || !profilepicture.tempFilePath) {
    //   return res.status(400).json({
    //     message: "Profile picture is missing or invalid",
    //   });
    // }

    // let fileUploader;
    // try {
    //   fileUploader = await cloudinary.uploader.upload(profilepicture.tempFilePath);
    // } catch (error) {
    //   console.error("Error uploading profile picture to Cloudinary:", error);
    //   return res.status(500).json({
    //     message: "Error uploading profile picture to Cloudinary",
    //   });
    

    // Create a new user instance
    const newUser = new userModel({
        lastName,
        firstName,
      email: email.toLowerCase(),
      password: hashedPassword,
      company_Name,
      role
      // profilepicture: {
      //   public_id: fileUploader.public_id,
      //   url: fileUploader.secure_url
      // }
    });
    // Construct a consistent full name
    const fullName = `${newUser.firstName.charAt(0).toUpperCase()}${newUser.firstName.slice(1).toLowerCase()} ${newUser.lastName.charAt(0).toUpperCase()}`;
    // console.log(fullName);

    // Save the new user to the database
    const savedUser = await newUser.save();

    
    

    const generateOTP = () => {
      const min = 1000;
      const max = 9999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  const otp = generateOTP();
  
  const subject = "Kindly verify";

    savedUser.newCode = otp
    const html = dynamicEmail(fullName, otp)

   
    Email({
      email: savedUser.email,
      html:html,
      subject,
    })



    await savedUser.save();


    // Respond with success message and user data
    res.status(201).json({
      message: "Welcome, User created successfully",
      data: savedUser, token
    })}
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};


// Function to resend the OTP incase the user didn't get the OTP
exports. resendOTP = async (req, res) => {
  try {
      const id = req.params.id;
      const user = await userModel.findById(id);

      const generateOTP = () => {
        const min = 1000;
        const max = 9999;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    const subject = 'Email Verification'
    const otp = generateOTP();

      user.newCode = otp
      const html = dynamicEmail(fullName, otp)
      Email({
        email: user.email,
        html,
        subject
      })
      await user.save()
      return res.status(200).json({
        message: "Please check your email for the new OTP"
      })
      
    
  } catch (err) {
    return res.status(500).json({
      message: "Internal server error: " + err.message,
    });
  }
};


//Function to verify a new user with an OTP
exports. verify = async (req, res) => {
  try {
    const id = req.body;
    //const token = req.params.token;
    const user = await userModel.findById(id);
    const { userInput } = req.body;
    // console.log(user);

    if (user && userInput === user.newCode) {
      // Update the user if verification is successful
      await userModel.findByIdAndUpdate(id, { isVerified: true }, { new: true });
    } else {
      return res.status(400).json({
        message: "Incorrect OTP, Please check your email for the code"
      })
    }
    if (user.isVerified === true) {
      return res.status(200).json("You have been successfully verified. Kindly visit the login page.");
    }

  } catch (err) {
      return res.status(500).json(
         err.message
      );
  }
};


exports. login = async (req, res) => {
  try {
    const { email, firstName, password } = req.body;

    // Check if the user exists with the provided email or Firstname
    const user = await userModel.findOne({
      $or: [{ email}, { firstName}],
    });
     //console.log(user);

    if (user) {
      // If the user exists, compare the password
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        // If password is correct, generate and send a token
        const token = jwt.sign(
          { id: user.id, email: user.email },
          process.env.SECRET,
          { expiresIn: '120s' }
        );

        return res.json({
          message: 'Login successful',
          user: { email: user.email, firstName: user.firstName },
          token,
        });
      } else {
        return res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      return res.status(401).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json(error.message);
  }
};

exports.getAllUsers= async(req,res)=>{

  const users= await userModel.find(req.params)

  if(!users){
    res.status(404).json('no users available')
  }
  else{
    res.status(200).json({message:"current users", users})
  }
}

exports.deleteUser = async (req, res) => {
  try {
      const { userId } = req.body;

      // Check if userId is provided
      if (!userId) {
          return res.status(400).json({ error: 'User ID is required' });
      }

      // Find the user by ID and delete
      const deletedUser = await userModel.findByIdAndDelete(userId);

      // Check if user exists
      if (!deletedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully', data: deletedUser });
  } catch (error) {
      console.error('Error deleting user:', error.message);
      return res.status(500).json(error.message);
  }
};



exports.resetPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if email is provided
        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Find the user by email
        const user = await userModel.findOne({ email });

        // If user doesn't exist, return error
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Set reset token and expiry in user document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

        // Save the updated user document
        await user.save();

        // Construct email options
        const emailOptions = {
            email: user.email,
            subject: 'Password Reset Request',
            html: `
                <p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
                <p>Please click on the following link, or paste this into your browser to complete the process:</p>
                <p><a href="http://${req.headers.host}/reset/${resetToken}">Reset Password</a></p>
                <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
            `
        };

        // Send password reset email
        await Email(emailOptions);

        // Respond with success message
        return res.status(200).json({ message: 'Reset password email sent successfully' });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
