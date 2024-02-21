const acctOfficerModel = require('../models/acctOfficer')
const bcrypt= require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv')



exports.login = async(req, res)=>{
    try{
         const { email, password} = req.body
         const checkUser = await acctOfficerModel.findOne({email: checkUser.email})
          if (!checkUser) {
            return res.status(404).json({message:'This email does not exist'})
         }

         const checkPassword = await bcrypt.compareSync(password,acctOfficerModel.password)
         if (!checkPassword) {
           return res.status(404).json({message:'Inavalid password, login with the password that was sent to your email address'})
         }

         const token = jwt.sign({userId:user_id},process.env.SECRET,{expiresIn:'60mins'})

         company_Name = userId
         
         res.status(200).json({message:'Logged In Successfully'})
         
    }catch(err){
        console.error(err);
        res.status(500).json({error:`Internal server error ${err.message}`})
    }
}
