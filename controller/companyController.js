const express= require("express")
const companyModel= require("../models/company.js")
const { gentoken } = require('../jwt');
const jwt = require("jsonwebtoken");
const accountManagerModel = require('../models/accountManager.js')
// const { validateCreateUser, validateLogin } = require('../validation/validation');
const cloudinary = require("../middleware/cloudinary");
const { dynamicEmail } = require("../html");
const {dynamicMail} = require('../invitationemail.js')
const bcrypt = require("bcrypt");
const crypto = require('crypto');
 const {Email} = require("../validation/email.js");
 const revokedToken= require("../models/revokedToken")

const createUser = async (req, res) => {
  try {
    const { email, password, confirmPassword, company_Name} = req.body;

    // Check for required fields
    if (!email || !password ||!company_Name  ||!confirmPassword) {
      return res.status(400).json({
        message: "Missing required fields."});
    }

    // Check if the email already exists
    const emailExist = await companyModel.findOne({ email: email.toLowerCase() });
    if (emailExist) {
      return res.status(400).json({
        message: "This email already exists",
      });
    }

    if(confirmPassword !== password){
      return res.status(400).json("password does not match, kindly type it again")
    }
    // Hash the password
const salt = await bcrypt.genSalt(12);
const hashedPassword = await bcrypt.hash(password, salt);

   
const generateCode = () => {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// console.log(generateCode)
 const  code = generateCode();
   // Upload profile picture to Cloudinary
    const profilePicture = req.files && req.files.profilePicture;
    if (!profilePicture || !profilePicture.tempFilePath) {
      return res.status(400).json({
        message: "Profile picture is missing or invalid",
      });
    }

    let fileUploader;
    try {
      fileUploader = await cloudinary.uploader.upload(profilePicture.tempFilePath);
    } catch (error) {
      console.error("Error uploading profile picture to Cloudinary:", error);
      return res.status(500).json({
        message: "Error uploading profile picture to Cloudinary",
      });
    
    }
    // Create a new user instance
      const newUser = new companyModel({                                        
      email: email.toLowerCase(),
      password: hashedPassword,
      company_Name:company_Name.toUpperCase(),
     role : 'Director', 
     company_code:code,     
      profilePicture: {
        public_id: fileUploader.public_id,
        url: fileUploader.secure_url
      }
    });

//     // const role = 'Director'
    
    //  Generate a JWT token
     const token = jwt.sign(
      {  email:newUser.email,userId:newUser._id, role:newUser.role,},
      process.env.SECRET,
      { expiresIn: "5mins" }
    );
    
//     // Construct a consistent full name
//     // const companyName = `${newUser.company_Name.charAt(0).toUpperCase()}${newUser.company_Name.slice(1).toLowerCase()}`;
//     // console.log(companyName);

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
    const html = dynamicEmail(newUser.company_Name, otp)

   
    Email({
      email: savedUser.email,
      html:html,
      subject,
    })



    await savedUser.save();


    // Respond with success message and user data
    res.status(201).json({
      message: `Welcome, ${newUser.company_Name}! Kindly check your email to verify. `,
      data: savedUser,
      // role: newUser.role,
      companyCode:newUser.company_code,
      token: token
    })
  }catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  
}
};


const resendOTP = async (req, res) => {
  try {
    const id = req.user._id
    const { email } = req.body;
    const user = await companyModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '5m' });

    const generateOTP = () => {
      const min = 1000;
      const max = 9999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const subject = 'Email Verification';
    const otp = generateOTP();
    user.newCode = otp;
    await user.save();

    const companyName = user.company_Name; // Ensure the correct variable name

    
    const html = dynamicEmail(companyName, link,otp);


    Email({
      email: user.email,
      html,
      subject
    });

    const result = {
      otp: otp,
      token: token 
    };

    return res.status(200).json({ message: 'Please check your email for the new OTP', data: result });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: 'An error occurred while resending OTP', error: error.message });
  }
};


// const getAllUsers= async (req, res) => {
//   try {
//     const {companyId} = req.body; 
//     if (!companyId){
//       return res.status(404).json('No Id')
//     }

//     const users = await companyModel.find({ companyId });

//     if (!users || users.length === 0) {
//       return res.status(404).json({ message: "No users found for the specified company" });
//     }

//     return res.status(200).json({ users });
//   } catch (err) {
//     return res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find the user by ID and delete
    const deletedUser = await companyModel.findByIdAndDelete(userId);

    // Check if user exists
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully'});
  } catch (error) {
    console.error('Error deleting user:', error.message);
    return res.status(500).json(error.message);
  }
};



// const resetPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     // Check if email is provided
//     if (!email) {
//       return res.status(400).json({ error: 'Email is required' });
//     }

//     // Generate a reset token
//     const resetToken = crypto.randomBytes(20).toString('hex');

//     const user = await companyModel.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Set reset token and expiry in user document
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

//     // Save the updated user 
//     await user.save();

//     // Construct email options
//     const emailOptions = {
//       email: user.email,
//       subject: 'Password Reset Request',
//       html: `
//                 <p>You are receiving this email because you (or someone else) has requested the reset of the password for your account.</p>
//                 <p>Please click on the following link, or paste this into your browser to complete the process:</p>
//                 <p><a href="http://${req.headers.host}/reset/${resetToken}">Reset Password</a></p>
//                 <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
//             `
//     };

//     // Send password reset email
//     await Email(emailOptions);
//     return res.status(200).json({ message: 'Reset password email sent successfully' });
//   } catch (error) {
//     console.error('Error resetting password:', error.message);
//     return res.status(500).json(error.message);
//   }
// };

exports.getOne = async (req, res) => {
  try {
    const id = req.params.id
    const oneUser = await companyModel.find(id)

    res.status(200).json({
      messsage: `user with email ${oneUser.email} has been found`

    })
  } catch (err) {
    res.status(404).json(err.message)
  }
}



exports.updateUser = async(req,res) => {
  try{
    const userId = req.user._id
    console.log(req.user)
    const user = await companyModel.findById(userId)
    console.log(user)
    if(!user) {
      return res.status(404).json({message:"User not found"})
    }
    const data={
company_Name: req.body.company_Name
    }

    const updates = await companyModel.findByIdAndUpdate(userId, {data:true}, {new:true})
    if(updates){
      return res.status(200).json({message:"User details has been edited successfully"},updates, user)
    }

   } catch(error){
    console.error('error editing user details:', error)
    res.json({error:error.message})
  }
}



const verifyUser = async (req, res) => {
  try {
    const { userInput } = req.body;
    const token = req.params.token; // Assuming token is passed in params

    // Decode the token to extract user ID
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId; // Assuming userId is included in the token payload

    // Check if the user exists
    const user = await companyModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Check if the user is already verified
    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    // Check if user has a verification code
    if (!user.newCode) {
      return res.status(400).json({ message: "No verification code found. Please request a new one." });
    }

    // Trim and stringify the userInput and newCode for comparison
    const userInputStr = String(userInput).trim();
    const newCodeStr = String(user.newCode).trim();

    // Compare the userInput with the stored OTP (newCode)
    if (userInputStr !== newCodeStr) {
      return res.status(400).json({ message: "Incorrect OTP. Please check your email for the correct code." });
    }

    // Update the user if verification is successful
    user.isVerified = true;
    await user.save();

    const link = 'https://finsworth-pro.vercel.app/logi'
    const html= dynamicEmail(user.company_Name,link)
    const subject='Kindly verify your account'

    await Email({
      link,html,subject
    })

    console.log("User verified:", user);
    return res.status(200).json({ message: "You have been successfully verified. Kindly visit the login page." });

  } catch (err) {
    console.error("Error during verification:", err);
    return res.status(500).json(err.message);
  }
};

const updateUser = async(req,res) => {
  try{
    const userId = req.user._id
    console.log(req.user)
    const user = await companyModel.findById(userId)
    console.log(user)
    if(!user) {
      return res.status(404).json({message:"User not found"})
    }
    const data={
company_Name: req.body.company_Name
    }

    const updates = await companyModel.findByIdAndUpdate(userId, {data:true}, {new:true})
    if(updates){
      return res.status(200).json({message:"User details has been edited successfully"},updates, user)
    }

   } catch(error){
    console.error('error editing user details:', error)
    res.json({error:error.message})
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or first name is provided
    if (!email && !password) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email or first name
    const user = await companyModel.findOne({
        email:email.toLowerCase() 
    });

    if (!user) {
      res.status(404).json({Message:" User not found"})
    }
    console.log(user);
      // Compare passwords
      const passwordMatch = await bcrypt.compareSync(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
     console.log(passwordMatch);
   
      if(user.isVerified === false){
       return res.status(400).json("Kindly verify with the OTP that is sent to your email before you can log in")
      }
     // Generate JWT token
const token = jwt.sign(
  { userId: user._id, email, role: 'Director' }, 
  process.env.SECRET, 
  { expiresIn: '2d' } 
);


       // Send login email
        await Email({
          email: user.email,
          subject: 'Successful Login',
          html: '<p>You have successfully logged in.</p>',
        });

        return res.json({
          message: 'Welcome back to FinsworthPRO',
          user: { email: user.email, company_Name: user.company_Name },
          token,
        });
      
  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json(error.message);
  }
};


const inviteUser = async (req, res)=>{
  try{
      const  userId = req.user._id
      const {invitedEmail, invitedUserRole} = req.body
console.log(req.user)
const company = await companyModel.findById(userId)
console.log(company)
      if(!company){
        return res.status(400).json({message: "User not found"})
      }
      
        
    
      const subject = `Invitation from ${company.company_Name}` ;
    const registrationLink = "https://yourapp.com/register"; // Replace this with your registration link
    const html = `<p>You have been invited to join your company as an ${invitedUserRole}. Please sign up using the link below:</p>
                 <a href=${registrationLink}>Register Now with the code ${company.company_code}</a>`;

    // Call the Email function to send the invitation email
    await Email({
      email : invitedEmail,
      subject,
      html
    });
   res.status(200).json({Message:"Invitation sent successfully"})
   console.log(`an email has been sent to ${invitedEmail} from ${company.company_Name}`)
  }catch(error){
    console.error('Error during invitation:', error.message);
    return res.status(500).json(error.message);
  }
};

const resetPassword = async (req, res) =>{
  try{
      // get the token from the params
      const {token} = req.params
      // get the new password from the body
      const {newPassword, confirmPassword} = req.body;
      // verify the validity of the token
      const decodedToken = jwt.verify(token, process.env.SECRET);
      // get the user that has the token 
      const user = await companyModel.findById(decodedToken.userId)
      if(newPassword !== confirmPassword){ 
          return res.status(404).json({
              message: "Password does not match, enter password again"
          })
      }
      if(!user){
          return res.status(404).json({
              message: "User not found"
          })
      }

      //  encrypt the user new password
      const salt = bcrypt.genSaltSync(10)
      const hash = bcrypt.hashSync(newPassword, salt)

      // update the user password in the database
      user.password = hash;
      //  save the changes to the database
      await user.save()

      res.status(200).json({
          message:"Password reset successfully"
      })
      
      
  }catch(err){
      res.status(500).json({
          error:err.message
      })
  }
}  

const forgotPassword = async (req, res) =>{
  try{
      // extract user email from the req.body
    const { email} = req.body
  //   find the user data  from the database using the email provided
    const user = await userModel.findOne({email})
  //   check if the user is existing in the database
  if(!user){ 
      return res.status(404).json({
          message:"User with email not found"
      })
  }
  // if a user is found generate a token for the user
  const token = jwt.sign({userId:user._id }, process.env.jwtSecret,{expiresIn:'10m'})
  console.log(token)

  const link = `${req.protocol}://${req.get('host')}/reset-password/${token}/${user.token}`;
  const html = dynamicMail(link, user.fullName.toUpperCase().slice(0, 1));

  await sendMail({
      email: user.email,
      subject:"Password reset",
      html
  });

  // send a suceess message
  res.status(200).json({
  message:"Reset password email sent successfully"
  })

  }catch(err){
      res.status(500).json({
          error:err.message
      })
  }
}


const signout = async (req, res) => {
  try{
      const userId = req.user.id;
      const user = await companyModel.findById(userId);

      const token = req.headers.authorization.split(' ')[1]

      if(!user){
          return res.status(404).json({
              message: 'This user does not exist or is already signed out'
          })
      }

       // Revoke token by setting its expiration to a past date
  const decodedToken = jwt.verify(token, process.env.SECRET);
  decodedToken.exp = 1;

  res.status(200).json({
      message: 'You have signed out successfully'
  })
      
      
  }catch(err){
      res.status(500).json({
          message: err.message
      })
  }
}


const getAcctUsers= async (req, res) => {
  try {
    
    const id = req.user._id

    const user = await companyModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: "No users found for the specified company" });
    }
const acctManager = await accountManagerModel.find({company:id})
// if(!acctManager || acctManager.length === 0) {
//   return res.status(404).json({error:""})
// }
    return res.status(200).json({ acctManager });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error: " + err.message });
  }
}

const changeProfilePicture = async (req, res) => {
  try {

      // get the id from the token
      const id = req.user.userId

      // get the user with the id
      const user = await companyModel.findById(id)
      if (!user) {
          return res.status(404).json({
              error:"user not found"
          })
      }

      // detroy the prvious image and update the new one
      if (user.profilePicture) {
          const oldImage = user.profilePicture.split("/").pop().split(".")[0]
          await cloudinary.uploader.destroy(oldImage)

      }

      // update the new image
      const file = req.files.profilePicture.tempFilePath
      const newImage = await cloudinary.uploader.upload(file)
      await userModel.findByIdAndUpdate(id,{profilePicture:newImage.secure_url},{new:true})

      res.status(200).json({
          message: "Successfully changed profile picture"
      })

  } catch (err) {
      res.status(500).json({
          error:err.message
      })
  }
}
module.exports = {
  verifyUser,
  login,
  inviteUser,
  forgotPassword,
  resetPassword,
  updateUser,
  resendOTP,
  resetPassword,
  getAcctUsers,
  deleteUser,
  createUser,
  changeProfilePicture,
  signout
}