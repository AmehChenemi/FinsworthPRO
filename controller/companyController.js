const express= require("express")
const companyModel= require("../models/company.js")
const { gentoken } = require('../jwt');
const jwt = require("jsonwebtoken");
const { validateCreateUser, validateLogin } = require('../validation/validation');
const cloudinary = require("../middleware/cloudinary");
const { dynamicEmail } = require("../html");
const {dynamicMail} = require('../invitationemail.js')
const bcrypt = require("bcrypt");
const crypto = require('crypto');
 const {Email} = require("../validation/email.js");
 const revokedToken= require("../models/revokedToken")

exports.createUser = async (req, res) => {
  try {
    const { error } = validateCreateUser({
      email: req.body.email,
      password: req.body.password,
      company_Name:req.body.company_Name,
      // role:req.body.role
    });
            if (error) {
       return res.status(400).json(error.message);
           } else {
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
     company_code:generateCode(),     
      profilePicture: {
        public_id: fileUploader.public_id,
        url: fileUploader.secure_url
      }
    });

    // const role = 'Director'
    
     // Generate a JWT token
     const token = jwt.sign(
      {  email,userId:newUser._id, role:newUser.role,},
      process.env.SECRET,
      { expiresIn: "1800s" }
    );
    
    // Construct a consistent full name
    // const companyName = `${newUser.company_Name.charAt(0).toUpperCase()}${newUser.company_Name.slice(1).toLowerCase()}`;
    // console.log(companyName);

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
      message: `Welcome, ${newUser.company_Name}! Your verification is complete. Please proceed to the login page.`,
      data: savedUser,
      // role: newUser.role,
      companyCode:newUser.company_code,
      token: token
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
    const user = await companyModel.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const generateOTP = () => {
      const min = 1000;
      const max = 9999;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    const subject = 'Email Verification'
    const otp = generateOTP();
    user.newCode = otp;
   
    // Retrieve user's full name from the database or another source
    const companyName = user.company_Name;
    
    const html = dynamicEmail(companyName, otp)
     Email({
      email: user.email,
      html,
      subject
    });

    await user.save();

    return res.status(200).json({ message: 'Please check your email for the new OTP' });
  } catch (error) {
    console.error('Error resending OTP:', error);
    return res.status(500).json({ message: 'An error occurred while resending OTP' });
  }
};


exports.verify = async (req, res) => {
  try {
    // const userId  = req.user.userId; 
    const userId  = req.user._id; 

    
    let userInput = req.body.userInput.trim(); 

    
    const user = await companyModel.findById(userId);

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    // Convert userInput and user.newCode to strings for comparison
    const userInputStr = String(userInput);
    const newCodeStr = String(user.newCode);

    if (userInputStr === newCodeStr) {
      // Update the user if verification is successful
      await companyModel.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
      return res.status(200).json({Message:"You have been successfully verified. Kindly visit the login page."});
    } else {
      return res.status(400).json({
        message: "Incorrect OTP, Please check your email for the code"
      });
    }
  } catch (err) {
    return res.status(500).json({ 
      message: "Internal server error: " + err.message,
    });
  }
};



exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email or first name is provided
    if (!email && !password) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email or first name
    const user = await companyModel.findOne({
        email 
    });

    if (!user) {
      res.status(404).json({Message:" User not found"})
    }
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
   
        // Generate JWT token
        const token = jwt.sign(
          { userId: user._id, email },
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
}

exports.inviteUser = async (req, res)=>{
  try{
      const  userId = req.user._id
      const {invitedEmail, invitedUserRole} = req.body
console.log(req.user)
const company = await companyModel.findById(userId)
console.log(company)
      if(!company){
        return res.status(400).json({message: "User not found"})
      }
      
        
      const code = generateCode();
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
    // console.error('Error during login:', error.message);
    return res.status(500).json(error.message);
  }
}



// exports.inviteUser = async (req, res) => {
//   try {
//   // console.log('welcome')
//   //   // Check if req.user is defined before accessing its properties
//   //   const currentUserRole = req.user ? req.user.role : null;
//   //   console.log('currentuserrole:',currentUserRole)
//   //   if (!currentUserRole) {
//   //     return res.status(403).json({ error: "User role not defined." });
//   //   }
//     const id = req.user.userId

//     const admin = await companyModel.findById(id)
//     // console.log(admin)
//     if(!admin){
//       return res.status(404).json({
//         message:"user not found"
//       })
//     }

//     const { invitedUserRole, invitedEmail } = req.body; // Assuming the role and email of the user to be invited are sent in the request body

//     // Check if the current user's role is admin
//     if (currentUserRole === 'Director') {
//       // Invite the user with the specified role via email
//       // console.log(`User with role '${currentUserRole}' is inviting a user with role '${invitedUserRole}' to email '${invitedEmail}'`);

//       // Send invitation email using the Email function
//       await sendInvitationEmail(invitedEmail, invitedUserRole);

//       res.status(200).json({ message: "Invitation sent successfully." });
//     } else {
//       res.status(403).json({ message: "You do not have permission to invite users." });
//       console.log(req.user)
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// };

// // Function to send invitation email
// async function sendInvitationEmail(email, invitedUserRole) {
//   try {
//     const subject = "Invitation to join our platform";
//     const registrationLink = "https://yourapp.com/register"; // Replace this with your registration link
//     const html = `<p>You have been invited to join our platform as an ${invitedUserRole}. Please register using the following link:</p>
//                  <a href=${registrationLink}>Register Now</a>`;

//     // Call the Email function to send the invitation email
//     await Email({
//       email,
//       subject,
//       html
//     });

//     console.log(`Invitation email sent to ${email}`);
//   } catch (error) {
//     console.error("Error sending invitation email:", error);
//     throw error; // Re-throw the error for handling in the controller
//   }
// }




exports.getAllUsers = async (req, res) => {
  try {
    // Find all users
    const users = await companyModel.find();

    // Check if any users are found
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users available' });
    }
    const userCount = users.length;

    res.status(200).json({ message: 'Current users', userCount, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json(error.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;

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



exports.resetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(20).toString('hex');

    const user = await companyModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Set reset token and expiry in user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour

    // Save the updated user 
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
    return res.status(200).json({ message: 'Reset password email sent successfully' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    return res.status(500).json(error.message);
  }
};

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

exports.forgotPassword = async (req, res) => {
  try {
    //get the email form the request body
    const { email } = req.body
    //  check if the user with the email provided is in the database
    const user = await companyModel.findOne({ email })
    if (!user) {
      res.status(404).json({
        message: "user with this email is not found"
      })
    }
    // if the user is existing in the database, generate a token for the user
    const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '10m' })
    //console.log(token)

    const link = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

    const html = dynamicEmail(link)

    await Email({
      email: user.email,
      subject: 'KINDLY VERIFY YOUR EMAIL TO RESET YOUR PASSWORD',
      html:'<p>please reset your password.</p>' //add a link
    })

    res.status(200).json({
      message: 'Mail sent successfully'
    })

  } catch (err) {
    res.status(500).json({
      error: err.message
    })
  }
}
  
   exports.signOut = async (req, res) => {
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