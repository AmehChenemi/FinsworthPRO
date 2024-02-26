const dotenv=require("dotenv")
dotenv.config()
const nodemailer = require("nodemailer");
//console.log(process.env.mailpassword)
const Email=async(options)=>{
const transporter = nodemailer.createTransport({

//  service:process.env.service,
host: 'smtp.gmail.com',
service : "gmail" ,
port: 587,
secure:false,

auth:{
  user:process.env.user,
  pass:process.env.mailpassword
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