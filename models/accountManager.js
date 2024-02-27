const mongoose= require("mongoose")

const accountSchema= new mongoose.Schema({
    fullNames:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
   company:{ type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    
    password:{
        type:String,
        required:true
    },
    company_Name:{
        type:String,
        required:true 
    },
    isVerified:{
        type:Boolean,
        default:false
    },
         
    role:{
        type:String,
        Default:'Account Manager'
    },
    // profilePicture:{
    //     public_id:{
    //         type:String,
    //         required:false
    //     }, 
    //     url:{
    //         type:String,
    //         required:false
    //     },
    // },

    budgets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Budget' }],
        
    

},{timestamps:true})


  const userModel= mongoose.model("Account Manager",accountSchema)

  module.exports= userModel