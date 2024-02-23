const dotenv=require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");
//console.log(process.env.mailpassword)
const Email=async(options)=>{
const transporter = nodemailer.createTransport({

 service:process.env.service,
  auth: {
    user:process.env.user ,
    pass:process.env.mailPassword,
  },
});

let mailOption={
    from:process.env.user,
    to:options.email,
    subject:options.subject,
    html:options.html
}

await transporter.sendMail(mailOption)
}
module.exports={Email}