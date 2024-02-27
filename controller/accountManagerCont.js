const accountManagerModel= require("../models/accountManager.js")
const companyModel = require("../models/company.js")
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv')
const {Email}= require("../validation/email")
const validation = require("../validation/acctManagervalidation.js")


exports.accountManagerSignup = async (req, res) => {
    try {
        const { fullNames, email, password, confirmPassword, company_Name, companyCode} = req.body;

           // Check for required fields
    if ( !fullNames|| !email || !password ||!confirmPassword ||!company_Name  ||!confirmPassword ||!companyCode) {
        return res.status(400).json({
          message: "Missing required fields."});
      }

        // Check if the email already exists
        const existingUser = await accountManagerModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const code = await companyModel.findOne({company_code:companyCode})
        if(!code) {
            return res.status(404).json({message:"Invalid company's code"})
        }

        const role = 'Account Manager'

     if(confirmPassword !== password){
      return res.status(400).json("password does not match, kindly type it again")
    }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new accountManagerModel({
            fullNames,
            email,
            company:code._id,
            role,
            password: hashedPassword,
            company_Name
        
        });

        // Save the user to the database
        await newUser.save();

        code.accountManager.push(newUser._id)

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET, { expiresIn: '60mins' });

        // Send welcome email
        await Email({
            email: newUser.email,
            subject: 'Welcome!!',
            html: `<p>Dear ${newUser.fullNames}, welcome onboard, your account has been created successfully!</p>`
        });

        // Respond with success message and token
        return res.status(201).json({ message: 'User created successfully', newUser, role,token });

    } catch (error) {
        console.error('Error during signup:', error.message);
        return res.status(500).json(error.message);
    }
};


exports.accountManagerlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if the user exists with the provided email
        const user = await accountManagerModel.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: 'This email does not exist' });
        }

        // Compare the password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(404).json({ message: 'Invalid password, login with the password that was sent to your email address' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET, { expiresIn: '60mins' });
        
     // Find the director user
      const Director = await companyModel.findOne({ role: 'Director' });

           if (!Director) {
               return res.status(404).json({ message: 'Director not found' });
           }
        // Send email alert to the director
        await Email({
            // email: 'agbakwuruoluchi29@gmail.com', // Provide the director's email address here
            email:Director.email,
            subject: 'Account Manager Login Alert',
            html: `<p> ${email} has just logged into FinsworthPro</p>`
        });

        // Respond with success message
        return res.status(200).json({ message: 'Logged In Successfully' , token});
        
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: `Internal server error ${err.message}` });
    }
};
