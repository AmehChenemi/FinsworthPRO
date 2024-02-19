const express= require("express")
const userModel= require("../models/userModel.js")
const { gentoken } = require('../jwt');
const jwt = require("jsonwebtoken");
const { validateCreateUser, validateLogin } = require('../validation/validation');
const cloudinary = require("../middleware/cloudinary");
const { dynamicEmail } = require("../html");
const bcrypt = require("bcrypt");
 const {Email} = require("../validation/email.js");
const { isAdmin } = require("../middleware/authorization.js");

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
    const id = req.params.id;
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
      return res.status(200).send("You have been successfully verified. Kindly visit the login page.");
    }

  } catch (err) {
      return res.status(500).json({
        message: "Internal server error: " + err.message,
      });
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


/*exports.onboardUser = async(req, res)=>{
  try {
    const id = req.body
    const userId = await userModel.findById(id)
    const {firstName, lastName, email} = req.body


    isAdmin === true
    if (!isAdmin ) {
      return res.status(400).json({message:'You are not allowed to perform this action'})
    }
    const generateRandomPassword = 
     const user = new user.create({
      firstName, lastName, email:email.toLowerCase()
     })
    
        // Sending a verification email to the user
        const subject = 'Kindly verify your account';
        const link = `${req.protocol}://${req.get('host')}/updateuser/${user._id}/${user.token}`;
        const html = dynamicMail(link, user.firstName.toUpperCase(), user.lastName.toUpperCase().slice(0, 1));
        await sendMail({
            email: user.email,
            subject,
            html
        });

    // const subject = 'Email Verification'
    // const html = dynamicEmail(fullName, otp)
    //   Email({
    //     email: user.email,
    //     html,
    //     subject
    //   })
      await user.save()
      return res.status(200).json({
        message: "Please check your email for your login details and sign in with the password sent to your email"
      })
    
  } catch (err) {
    return res.status(500).json(err.message);
    
  }
}*/