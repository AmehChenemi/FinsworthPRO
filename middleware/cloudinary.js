const cloudinary = require ('cloudinary').v2
// const const cloudinary= require("cloudinary")
require("dotenv").config()
          
// v2.config({ 
//   cloud_name: process.env.cloud_name, 
//   api_key:process.env.api_key, 
//   api_secret: process.env.api_secret
// });

cloudinary.config({ 
    cloud_name: 'dheu5jnjj', 
    api_key: '728462279138892', 
    api_secret: 'xVkBFIfq68y7nLotoUJWs7RYCD8' 
  });
module.exports= cloudinary