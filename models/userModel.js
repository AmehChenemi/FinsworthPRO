const mongoose= require("mongoose")

const userSchema= new mongoose.Schema({
    fullNames:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
   company_Name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
   
    newCode:{
        type:String
    },
    role:{
        type:String,
        enum:["Director",'Account Manager'],
       
        required: true
    },

    userInput:{
        type:String
    },

    isVerified:{
        type:Boolean,
        default:false
    },
    
    token:{
        type:String
        
    },
    confirmPassword:{
        type:String
        
    },
    profilePicture:{
        public_id:{
            type:String,
            required:false
        }, 
        url:{
            type:String,
            required:false
        },
    },

    budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }]
    

},{timestamps:true})


  const userModel= mongoose.model("User",userSchema)

  module.exports= userModel